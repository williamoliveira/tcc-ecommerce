import { delay, END } from 'redux-saga'
import { replace } from 'react-router-redux'
import qs from 'qs'
import { put, takeLatest, call, take, fork, select, takeEvery } from 'redux-saga/effects'
import * as actions from './actions'
import { actions as authActions, selectors as authSelectors } from '../auth'
import toast from '../../utils/toast'
import { REHYDRATE } from '../../utils/reduxSagaPersistor'

const getUserFriendlyMessageFromError = (error) => {
  // not axios error
  if (!error.response || !error.response.data) {
    return error.message
  }

  // axios error...

  const statusMap = {
    500:
      'Ocorreu um erro interno no servidor. \n\n' +
      'A equipe de desenvolvimento já foi notificada ' +
      'e estará verificando o problema o mais rápido possível. \n\n' +
      'Pedimos desculpas pelo transtorno.',
    401: 'Falha na autenticação',
  }

  return (
    (error.response.status in statusMap
      ? statusMap[error.response.status]
      : error.response.data.message) || 'Ocorreu um erro.'
  )
}

export function* errorHandlerSaga({ payload, payload: { error, action } }) {
  console.log('errorHandler', payload)

  // user access token is no longer valid and requires api re-login
  if (error.response && error.response.status && error.response.status === 401) {
    yield put(authActions.logout())
    yield put(authActions.refreshToken())

    return
  }

  // any other critical error
  const message = yield call(getUserFriendlyMessageFromError, error)
  yield call(toast, message, { type: 'error' })
}

function* beforeAppStartSaga() {
  yield put(actions.startRehydration())
  yield take(actions.rehydrationDone)

  const user = yield select(authSelectors.getUser)
  const accessToken = yield select(authSelectors.getAccessToken)

  if (!user && accessToken) {
    yield put(authActions.fetchUser())
    yield take([authActions.fetchUserSuccess, authActions.fetchUserFailed])
  }

  yield put(actions.beforeAppStartDone())
}

function* beforeAppStartDoneSaga() {
  yield put(actions.appStarted())
}

export function* initialFetchHandlerSaga() {
  let waiting = 0
  let ended = false

  yield takeEvery(actions.initialFetchStarted, () => {
    waiting += 1
  })

  // eslint-disable-next-line func-names
  yield takeEvery([actions.initialFetchSuccess, actions.initialFetchFailed], function* () {
    waiting -= 1

    if (waiting <= 0) {
      yield put(END)
      ended = true
    }
  })

  yield take(actions.appStarted)

  // if before 5ms 'waiting' still 0, probably 'initialFetchStarted' was never called
  yield delay(5)
  if (!ended && waiting <= 0) {
    // eslint-disable-next-line no-console
    console.log('No saga called initialFetchStarted withing 5ms')
    yield put(END)
  }
}

export function toQueryString(filters) {
  return `?${qs.stringify(filters)}`
}

export function fromQueryString(queryString) {
  return qs.parse(queryString.substring(1, queryString.length))
}

export function* setLocationSearchSaga(action) {
  const { payload: { search, force = false } } = action

  const currentSearchString = yield select(state => state.router.location.search)
  const currentSearch = yield call(fromQueryString, currentSearchString)

  const newSearch = { ...currentSearch, ...search }
  const newSearchString = yield call(toQueryString, newSearch)

  if (!(force || newSearchString !== currentSearchString)) {
    return
  }

  const newLocation = { search: newSearchString }

  yield put(replace(newLocation))
}

export function requestNotificationPermissionSaga() {
  if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }
}

export function* showToastSaga({ payload }) {
  const { message, ...options } = payload

  yield call(toast, message, options)
}

export function* reportErrorSaga({ payload }) {
  yield put(actions.error(payload))
}

export function* readySaga() {
  yield take(actions.appStarted)

  if (yield select(authSelectors.getIsLogged)) {
    yield put(actions.ready())
    return
  }

  yield take([authActions.loggedIn])
  yield put(actions.ready())
}

export function* rehydrateDoneSaga() {
  yield put(actions.rehydrationDone())
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.beforeAppStart, beforeAppStartSaga)
  yield takeLatest(actions.beforeAppStartDone, beforeAppStartDoneSaga)
  yield takeLatest(actions.appStarted, requestNotificationPermissionSaga)
  yield takeLatest(actions.setLocationSearch, setLocationSearchSaga)
  yield takeEvery(actions.error, errorHandlerSaga)
  yield takeEvery(actions.showToast, showToastSaga)
  yield takeEvery(REHYDRATE, rehydrateDoneSaga)
  yield fork(readySaga)

  if (process.env.BUILD_FLAG_IS_SERVER === 'true') {
    yield fork(initialFetchHandlerSaga)
  }
}
