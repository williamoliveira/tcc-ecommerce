import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import { actions as appActions } from '../modules/app'
import { injectReducer } from './hooks'
import { makeRootReducer } from './reducers'
import injectModules from '../modules'
import { injectSaga, makeStartSagas } from './sagas';

(typeof window !== 'undefined' ? window : global).log = (val, message = '[LOG]') => {
  console.log(message, val)
  return val
}

const logging = () => next => (action) => {
  console.log('DISPATCHED:', action.type)
  next(action)
}

export default (state, { history, cookies }) => {
  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [sagaMiddleware, routerMiddleware(history)]

  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    middlewares.push(logging)
  }

  const enhancers = [applyMiddleware(...middlewares)]

  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    const devToolsEnhancer = require('redux-devtools-extension').devToolsEnhancer
    enhancers.push(devToolsEnhancer())
  }

  const enhancer = compose(...enhancers)
  const rootReducer = makeRootReducer({}, state)
  const store = createStore(rootReducer, state, enhancer)

  store.custom = {
    history,
    cookies,
    asyncReducers: {},
    sagas: [],
    runningTasks: [],
    runSaga: saga => sagaMiddleware.run(saga, store),
    startSagas: makeStartSagas(store),
    injectSaga: injectSaga(store),
    injectReducer: injectReducer(store),
    injectedModules: {},
    injectModule: module => module(store),
  }

  injectModules(store)

  if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
    module.hot.accept('./reducers', () => {
      require('./reducers').reloadReducers(store)
    })
  }

  return Promise.resolve()
    .then(() => store.dispatch(appActions.beforeAppStart()))
    .then(
      () =>
        process.env.BUILD_FLAG_IS_NODE === 'true' &&
        Promise.all(store.custom.runningTasks.map(task => task.done)),
    )
    .then(() => store)
}
