import Loadable from '@7rulnik/react-loadable'
import { getBundles } from '@7rulnik/react-loadable/webpack'
import createMemoryHistory from 'history/createMemoryHistory'
import { parsePath } from 'history/PathUtils'
import React from 'react'
import asyncBootstrapper from 'react-async-bootstrapper'
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component'
import {
  renderToNodeStream,
  renderToStaticMarkup,
  renderToString,
} from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import config from '../../../../config'
import App from '../../../app/components/App'
import { actions as appActions } from '../../../app/modules/app'
import configureStore from '../../../app/store/configureStore'
import getReactLoadableStats from './getReactLoadableStats'
import ServerHTML from './ServerHTML'
import StaticContextProvider from './StaticContextProvider'

const stats = getReactLoadableStats()

let preloaded = false
const preloadAsyncComponents = async () => {
  if (preloaded) return
  await Loadable.preloadAll()
  preloaded = true
}

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
    let modules = []

    const initialState = {
      router: { location: initialLocation },
    }
    const [store] = await Promise.all([
      configureStore(initialState, { history, cookies: request.cookies }),
      preloadAsyncComponents(),
    ])

    const AppContainer = () => (
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <AsyncComponentProvider asyncContext={asyncComponentsContext}>
          <ReduxProvider store={store}>
            <StaticContextProvider context={reactRouterContext}>
              <ConnectedRouter history={history}>
                <HelmetProvider context={helmetContext}>
                  <App />
                </HelmetProvider>
              </ConnectedRouter>
            </StaticContextProvider>
          </ReduxProvider>
        </AsyncComponentProvider>
      </Loadable.Capture>
    )

    store.custom.startSagas()
    store.dispatch(appActions.appStarted())

    await asyncBootstrapper(<AppContainer />)

    if (process.env.BUILD_FLAG_IS_NODE === 'true') {
      await Promise.all(store.custom.runningTasks.map(task => task.done))
    }

    modules = []
    const reactAppString = renderToString(<AppContainer />)
    const bundles = getBundles(stats, modules)

    const htmlStream = renderToNodeStream(
      <ServerHTML
        nonce={nonce}
        helmet={helmetContext.helmet}
        appState={store.getState()}
        asyncComponentsState={asyncComponentsContext.getState()}
        bundles={bundles}
        reactAppString={reactAppString}
      />,
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
