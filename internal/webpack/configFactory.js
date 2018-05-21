import appRootDir from 'app-root-dir'
import AssetsPlugin from 'assets-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { ReactLoadablePlugin } from '@7rulnik/react-loadable/webpack'
import path from 'path'
import webpack from 'webpack'
import { log } from '../utils'
import { ifElse } from '../utils/logic'
import { clean } from '../utils/arrays'
import withServiceWorker from './withServiceWorker'
import config from '../../config'

export default function (buildOptions) {
  const { target, optimize = false } = buildOptions

  const isProd = optimize
  const isDev = !isProd
  const isClient = target === 'client'
  const isServer = target === 'server'
  const isNode = !isClient

  const ifDev = ifElse(isDev)
  const ifProd = ifElse(isProd)
  const ifNode = ifElse(isNode)
  const ifClient = ifElse(isClient)
  const ifDevClient = ifElse(isDev && isClient)
  const ifProdClient = ifElse(isProd && isClient)

  log({
    level: 'info',
    title: 'Webpack',
    message: `Creating ${
      isProd ? 'an optimised' : 'a development'
    } bundle configuration for the "${target}"`,
  })

  const bundleConfig =
    isServer || isClient
      ? config(['bundles', target])
      : config(['additionalNodeBundles', target])

  if (!bundleConfig) {
    throw new Error('No bundle configuration exists for target:', target)
  }

  const localIdentName = ifDev('[name]_[local]_[hash:base64:5]', '[hash:base64:10]')

  const postCssLoaderOptions = {
    plugins: () => [
      require('postcss-simple-vars'),
      require('postcss-cssnext'),
      require('postcss-import'),
    ],
  }

  let webpackConfig = {
    mode: ifDev('development', 'production'),
    context: appRootDir.get(),
    entry: {
      index: clean([
        ifClient('regenerator-runtime/runtime'),
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(
          () =>
            `webpack-hot-middleware/client?reload=true&path=http://${config(
              'host',
            )}:${config('clientDevServerPort')}/__webpack_hmr`,
        ),
        path.resolve(appRootDir.get(), bundleConfig.srcEntryFile),
      ]),
    },

    output: {
      path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
      filename: ifProdClient('[name]-[chunkhash].js', ifNode('index.js', '[name].js')),
      chunkFilename: '[name]-[chunkhash].js',
      libraryTarget: ifNode('commonjs2', 'var'),
      publicPath: ifDev(
        `http://${config('host')}:${config('clientDevServerPort')}${config(
          'bundles.client.webPath',
        )}`,
        bundleConfig.webPath,
      ),
      hotUpdateChunkFilename: '[hash].hot-update.js',
    },

    target: isClient ? 'web' : 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    devtool: ifElse(
      isNode || isDev || config('includeSourceMapsForOptimisedClientBundle'),
    )('cheap-module-source-map', 'hidden-source-map'),

    performance: ifProdClient({ hints: 'warning' }, false),

    optimization: {
      runtimeChunk: !config('disableCodeSplitting') && isClient ? 'single' : false,
      minimizer: ifProdClient([
        new UglifyJsPlugin({
          uglifyOptions: {
            ecma: 8,
            compress: {
              warnings: false,
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: config('includeSourceMapsForOptimisedClientBundle'),
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: { discardComments: { removeAll: true } },
        }),
      ]),
    },

    resolve: {
      extensions: config('bundleSrcTypes').map(ext => `.${ext}`),
      alias: {
        modernizr$: path.resolve(appRootDir.get(), './.modernizrrc'),
      },
    },

    externals: clean([
      ifNode(() =>
        nodeExternals({
          whitelist: clean(['source-map-support/register']).concat(
            config('nodeExternalsFileTypeWhitelist') || [],
          ),
        }),
      ),
    ]),

    plugins: clean([
      ifNode(
        () =>
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
          }),
      ),

      ifNode(
        () =>
          new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
          }),
      ),

      new webpack.EnvironmentPlugin({
        NODE_ENV: isProd ? 'production' : 'development',
        BUILD_FLAG_IS_CLIENT: JSON.stringify(isClient),
        BUILD_FLAG_IS_SERVER: JSON.stringify(isServer),
        BUILD_FLAG_IS_NODE: JSON.stringify(isNode),
        BUILD_FLAG_IS_DEV: JSON.stringify(isDev),
        DISABLE_CODE_SPLITTING: JSON.stringify(config('disableCodeSplitting')),
      }),

      ifClient(
        () =>
          new AssetsPlugin({
            filename: config('bundleAssetsFileName'),
            path: path.resolve(appRootDir.get(), bundleConfig.outputPath),
          }),
      ),

      ifClient(
        () =>
          new ReactLoadablePlugin({
            filename: path.resolve(
              appRootDir.get(),
              bundleConfig.outputPath,
              config('webpackStatsFileName'),
            ),
          }),
      ),

      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),

      // ifElse(!config('serviceWorker.enabled'))(() => new HardSourceWebpackPlugin()),

      ifDevClient(
        () =>
          new webpack.HotModuleReplacementPlugin({
            multiStep: true,
          }),
      ),

      ifClient(
        () =>
          new MiniCssExtractPlugin({
            filename: '[name]-[chunkhash].css',
            chunkFilename: '[name]-[chunkhash].css',
          }),
      ),
    ]),

    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: clean([
            {
              test: /\.(js|jsx|mjs)$/,
              loader: 'babel-loader',
              options: config('plugins.babelConfig')(
                {
                  babelrc: false,
                  presets: clean([
                    'react',
                    'stage-3',
                    ifClient(['@babel/preset-env', { modules: false }]),
                    ifNode(['@babel/preset-env', { targets: { node: true } }]),
                  ]),
                  plugins: clean([
                    ifDevClient('react-hot-loader/babel'),
                    ifDev('transform-react-jsx-self'),
                    ifDev('transform-react-jsx-source'),
                    ifProd('transform-react-inline-elements'),
                    ifProd('transform-react-constant-elements'),
                    // ifNode('syntax-dynamic-import'),
                    '@7rulnik/react-loadable/babel',
                  ]),
                },
                buildOptions,
              ),
              include: clean([
                ...bundleConfig.srcPaths.map(srcPath =>
                  path.resolve(appRootDir.get(), srcPath),
                ),
                ifProdClient(path.resolve(appRootDir.get(), 'src/html')),
                path.resolve(__dirname, '../../lib'),
                path.resolve(__dirname, '../../src'),
              ]),
            },

            ifElse(isClient || isServer)({
              test: /(\.scss|\.css)$/,
              use: ifClient(
                [
                  MiniCssExtractPlugin.loader,
                  // ifProd(MiniCssExtractPlugin.loader, 'style-loader'),
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: true,
                      localIdentName,
                    },
                  },
                  { loader: 'postcss-loader', options: postCssLoaderOptions },
                  { loader: 'sass-loader', options: { outputStyle: 'expanded' } },
                ],
                [
                  'css-loader/locals',
                  { loader: 'postcss-loader', options: postCssLoaderOptions },
                  { loader: 'sass-loader', options: { outputStyle: 'expanded' } },
                ],
              ),
            }),

            ifElse(isClient || isServer)(() => ({
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'static/[hash].[ext]',
              },
            })),

            ifElse(isClient || isServer)(() => ({
              loader: 'file-loader',
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/[hash].[ext]',
                publicPath: isDev
                  ? `http://${config('host')}:${config('clientDevServerPort')}${config(
                    'bundles.client.webPath',
                  )}`
                  : `${config('bundles.client.webPath')}`,
                emitFile: isClient,
              },
            })),
          ]),
        },
      ],
    },
  }

  if (isProd && isClient && config('serviceWorker.enabled')) {
    webpackConfig = withServiceWorker(webpackConfig, bundleConfig)
  }

  return config('plugins.webpackConfig')(webpackConfig, buildOptions)
}
