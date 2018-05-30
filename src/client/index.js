import '@babel/polyfill'
import 'proxy-polyfill/proxy.min'
import Loadable from '@7rulnik/react-loadable'
import createBrowserHistory from 'history/createBrowserHistory'
import pick from 'lodash/pick'
import React from 'react'
import { hydrate, render } from 'react-dom'
import ErrorBoundary from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { AppContainer as ReactHotLoader } from 'react-hot-loader'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import config from '../../config'
import App from '../app/components/App'
import configureStore from '../app/store/configureStore'

const container = document.querySelector('#app')
const supportsHistory = 'pushState' in window.history
const asyncComponentsRehydrateState = window.__ASYNC_COMPONENTS_REHYDRATE_STATE__
const appRehydrateState = window.__APP_REHYDRATE_STATE__

const history = createBrowserHistory()
const appWasServerRendered = !!container.children.length
const renderOrHydrate = appWasServerRendered ? hydrate : render
const helmetContext = {}

async function renderApp(TheApp) {
  const initialState = appRehydrateState || {
    router: {
      location: pick(window.location, ['search']),
    },
  }
  const store = await configureStore(initialState, { history, appWasServerRendered })

  const app = (
    <ErrorBoundary FallbackComponent={() => 'Ocorreu um erro na renderização.'}>
      <ReactHotLoader>
        <ReduxProvider store={store}>
          <ConnectedRouter
            history={history}
            basename={config('basename')}
            forceRefresh={!supportsHistory}
          >
            <HelmetProvider context={helmetContext}>
              <TheApp />
            </HelmetProvider>
          </ConnectedRouter>
        </ReduxProvider>
      </ReactHotLoader>
    </ErrorBoundary>
  )

  await Loadable.preloadReady()
  await renderOrHydrate(app, container)
}

renderApp(App)

require('./registerServiceWorker')

if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
  module.hot.accept('./index.js')
  module.hot.accept('../app/components/App', () => {
    renderApp(require('../app/components/App').default)
  })
}
