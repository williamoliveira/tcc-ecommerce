import appRootDir from 'app-root-dir'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import { resolve as pathResolve } from 'path'
import rendertron from 'rendertron-middleware'
import config from '../../config'
import clientBundle from './middlewares/clientBundle'
import errorHandlers from './middlewares/errorHandlers'
import offlinePage from './middlewares/offlinePage'
import reactApplication from './middlewares/reactApplication'
import security from './middlewares/security'
import serviceWorker from './middlewares/serviceWorker'

const app = express()

app.disable('x-powered-by')
app.use(...security)
app.use(cookieParser())

if (config('enableCompression')) {
  app.use(compression())
}

if (config('enablePrerender')) {
  app.use(
    rendertron.makeMiddleware({
      proxyUrl: `${config('prerenderUrl')}/render`,
      userAgentPattern: new RegExp(
        [...rendertron.botUserAgents, 'googlebot', 'WhatsApp'].join('|'),
        'i',
      ),
    }),
  )
}

if (process.env.BUILD_FLAG_IS_DEV === 'false' && config('serviceWorker.enabled')) {
  app.get(`/${config('serviceWorker.fileName')}`, serviceWorker)
  app.get(
    `${config('bundles.client.webPath')}${config('serviceWorker.offlinePageFileName')}`,
    offlinePage,
  )
}

app.use(config('bundles.client.webPath'), clientBundle)
app.use(express.static(pathResolve(appRootDir.get(), config('publicAssetsPath'))))
app.get('*', (request, response) => {
  console.log(`REQUEST: Received for "${request.url}"`)
  return reactApplication(request, response)
})
app.use(...errorHandlers)

const listener = app.listen(config('port'), () =>
  console.log(`✓ ${config('htmlPage.defaultTitle')} is ready!
Service Workers: ${config('serviceWorker.enabled')}
Polyfills: ${config('polyfillIO.enabled')} (${config('polyfillIO.features').join(', ')})
Server is now listening on Port ${config('port')}
You can access it in the browser at http://${config('host')}:${config('port')}
Press Ctrl-C to stop.
`),
)

export default listener
