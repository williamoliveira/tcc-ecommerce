import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { renderToNodeStream, renderToStaticMarkup } from 'react-dom/server'
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import createMemoryHistory from 'history/createMemoryHistory'
import { parsePath } from 'history/PathUtils'
import { ReportChunks } from 'react-universal-component'
import flushChunks from 'webpack-flush-chunks'
import { clearChunks, flushChunkNames } from 'react-universal-component/server'
import configureStore from '../../../app/store/configureStore'
import config from '../../../../config'
import ServerHTML from './ServerHTML'
import App from '../../../app/components/App'
import StaticContextProvider from './StaticContextProvider'
import { actions as appActions } from '../../../app/modules/app'
import getReactLoadableStats from './getReactLoadableStats'
import getClientBundleEntryAssets from './getClientBundleEntryAssets'

const assets = getClientBundleEntryAssets()
const stats = getReactLoadableStats()

const respondStatic = (response, nonce) => {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(<ServerHTML nonce={nonce} />)}`
  response
    .status(200)
    .type('html')
    .send(html)
}

export default async (request, response) => {
  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    console.log(`REQUEST: Received for "${request.url}"`)
  }

  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response')
  }
  const nonce = response.locals.nonce

  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      console.log('==> Handling react route without SSR')
    }

    respondStatic(response, nonce)
    return
  }

  try {
    const initialLocation = parsePath(request.url)
    const history = createMemoryHistory({
      initialEntries: [initialLocation],
      initialIndex: 0,
    })
    const asyncComponentsContext = createAsyncContext()
    const reactRouterContext = {}
    const helmetContext = {}
    const chunkNames = []

    const store = await configureStore({}, { history, cookies: request.cookies })

    const AppContainer = () => (
      <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
        <ReduxProvider store={store}>
          <StaticContextProvider context={reactRouterContext}>
            <ConnectedRouter history={history}>
              <HelmetProvider context={helmetContext}>
                <App />
              </HelmetProvider>
            </ConnectedRouter>
          </StaticContextProvider>
        </ReduxProvider>
      </ReportChunks>
    )

    store.custom.startSagas()
    store.dispatch(appActions.appStarted())
    clearChunks()
    await renderToStaticMarkup(<AppContainer />)
    flushChunkNames()

    console.log('chunkNames', chunkNames)
    const bundles = chunkNames.reduce(
      (bundles, chunkName) => {
        Object.entries(assets)
          .filter(([key]) => key === chunkName || key.endsWith(`~${chunkName}`))
          .forEach(([key, value]) => {
            if (value.js) bundles.js.push(value.js)
            if (value.css) bundles.css.push(value.css)
          })

        return bundles
      },
      { js: [], css: [] },
    )
    console.log(bundles)

    // console.log(chunkNames)
    // const bundles = flushChunks(stats, { chunkNames })
    // console.log(bundles)

    if (process.env.BUILD_FLAG_IS_NODE === 'true') {
      await Promise.all(store.custom.runningTasks.map(task => task.done))
    }

    const htmlStream = renderToNodeStream(
      <ServerHTML
        nonce={nonce}
        helmet={helmetContext.helmet}
        appState={store.getState()}
        asyncComponentsState={asyncComponentsContext.getState()}
        bundles={bundles}
      >
        <AppContainer />
      </ServerHTML>,
    )

    switch (reactRouterContext.status) {
      case 301:
      case 302:
        response
          .status(reactRouterContext.status)
          .location(reactRouterContext.url)
          .end()
        break
      default:
        response
          .status(reactRouterContext.status || 200)
          .type('html')
          .write('<!doctype html>')
        htmlStream.pipe(response)
    }
  } catch (err) {
    console.error(err)
    respondStatic(response, nonce)
  }
}
