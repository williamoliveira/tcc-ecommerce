import { take, fork } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { matchPath } from 'react-router'

// eslint-disable-next-line func-names
export default (route, saga, ...args) =>
  fork(function* () {
    let count = 0
    const routes = Array.isArray(route) ? route : [route]

    while (true) {
      const action = yield take(LOCATION_CHANGE)
      const matches = routes.filter(r => matchPath(action.payload.pathname, r))

      if (matches.length) {
        count += 1
        yield fork(saga, ...[...args, action, { count }])
      }
    }
  })
