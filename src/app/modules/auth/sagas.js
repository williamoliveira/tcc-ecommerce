/* eslint-disable func-names */
import { put, takeLatest, takeEvery, call, select, fork } from 'redux-saga/effects'
import pick from 'lodash/pick'
import CookieStorage from 'redux-persist-cookie-storage'
import * as actions from './actions'
import * as selectors from './selectors'
import { actions as appActions } from '../app'
import authApi from './services/authApiAuthedSaga'
import config from '../../../../config'
import putAndWait from '../../utils/sagas/putAndWait'
import { reportErrorSaga } from '../app/sagas'
import toast from '../../utils/toast'
import {
  createPersistStateSaga,
  createRehydrateStateSaga,
} from '../../utils/reduxSagaPersistor'
import { KEY } from './reducers'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchTokenSaga(action) {
  const { username, password, scope = '*' } = action.payload

  try {
    yield put(actions.fetchTokenStarted())

    const grantData = {
      grant_type: 'password',
      client_id: config('clientId'),
      client_secret: config('clientSecret'),
      username,
      password,
      scope,
    }

    // TODO race timeout
    const res = yield call(authApi.fetchToken, grantData)

    const tokenData = {
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      expiresIn: res.expires_in,
      tokenType: res.token_type,
    }

    yield put(actions.fetchTokenSuccess(tokenData))
  } catch (error) {
    yield put(actions.fetchTokenFailed({ error, action }))
  }
}

export function* refreshTokenSaga(action) {
  try {
    yield put(actions.fetchTokenStarted())

    const refreshToken = yield select(selectors.getRefreshToken)

    if (!refreshToken) {
      throw new Error('No refresh token stored.')
    }

    const grantData = {
      grant_type: 'refresh_token',
      client_id: config('clientId'),
      client_secret: config('clientSecret'),
      refresh_token: refreshToken,
    }

    // TODO race timeout
    const res = yield call(authApi.fetchToken, grantData)

    const tokenData = {
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      expiresIn: res.expires_in,
      tokenType: res.token_type,
    }

    yield put(actions.fetchTokenSuccess(tokenData))
  } catch (error) {
    yield put(actions.fetchTokenFailed({ error, action }))
  }
}

export function* updateUserSaga(action) {
  try {
    const { payload } = action
    yield put(actions.updateUserStarted())

    const localUser = yield select(selectors.getUser)

    const userDataAttempt = pick(
      {
        ...localUser,
        ...payload,
      },
      ['name', 'email', 'password'],
    )

    const serverUser = yield call(authApi.updateUser, userDataAttempt)

    const user = { ...localUser, ...serverUser }

    yield put(actions.updateUserSuccess({ user }))
  } catch (error) {
    yield put(actions.updateUserFailed({ error, action }))
  }
}

export function* fetchUserSaga(action) {
  try {
    yield put(actions.fetchUserStarted())

    const query = {
      include: ['permissions'],
    }

    const userData = yield call(authApi.fetchUser, query)

    yield put(actions.fetchUserSuccess(userData))
  } catch (error) {
    yield put(actions.fetchUserFailed({ error, action }))
  }
}

export function* attemptLoginSaga(action) {
  try {
    const { payload } = action
    yield put(actions.attemptLoginStarted(payload))

    yield call(
      putAndWait,
      actions.fetchToken(payload),
      actions.fetchTokenSuccess,
      actions.fetchTokenFailed,
    )

    const fetchUserSuccessPayload = yield call(
      putAndWait,
      actions.fetchUser(payload),
      actions.fetchUserSuccess,
      actions.fetchUserFailed,
    )

    yield put(actions.attemptLoginSuccess(fetchUserSuccessPayload))
  } catch (error) {
    yield put(actions.attemptLoginFailed({ error, action }))
  }
}

function* invalidCredentials() {
  yield call(toast, 'Credenciais inválidas', { type: 'error' })
}

export function* attemptLoginFailedSaga({ payload }) {
  // repass any error that is not 400 to app global error handler
  if (payload.error.response && payload.error.response.status !== 400) {
    yield put(appActions.error(payload))
    return
  }

  yield call(invalidCredentials)
}

export function* fetchUserSuccessSaga({ payload }) {
  yield put(actions.loggedIn())

  // TODO check why crash
  // if (process.env.NODE_ENV !== 'development') {
  //   yield call(Raven.setUserContext, {
  //     email: payload.email,
  //     id: payload.id,
  //   })
  // }
}

export function logoutSaga() {
  if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
    window.location.reload()
  }
}

export const rehydrationSaga = persistConfig =>
  function* () {
    yield fork(createRehydrateStateSaga(persistConfig))
  }

// ------------------------------------
// Watchers
// ------------------------------------
export default store =>
  function* () {
    const persistConfig = {
      key: KEY,
      whitelist: ['accessToken'],
      storage: new CookieStorage({
        indexKey: 'reduxSagaPersistor',
        cookies: store.custom.cookies,
        expiration: { default: 365 * 86400 },
      }),
      selector: selectors.getStateSlice,
    }
    yield takeEvery(Object.values(actions), createPersistStateSaga(persistConfig))
    yield takeLatest(appActions.startRehydration, rehydrationSaga(persistConfig))

    yield takeLatest(actions.attemptLogin, attemptLoginSaga)
    yield takeLatest(actions.fetchToken, fetchTokenSaga)
    yield takeLatest(actions.fetchUser, fetchUserSaga)
    yield takeLatest(actions.attemptLoginFailed, attemptLoginFailedSaga)
    yield takeLatest(actions.updateUser, updateUserSaga)
    yield takeLatest(actions.refreshToken, refreshTokenSaga)
    yield takeLatest(actions.fetchUserSuccess, fetchUserSuccessSaga)
    yield takeLatest(actions.logout, logoutSaga)
    yield takeEvery(actions.updateUserFailed, reportErrorSaga)
    yield takeEvery(actions.fetchUserFailed, reportErrorSaga)
  }
