import { put, takeLatest, takeEvery, call } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import * as actions from './actions'
import registerApi from './services/registerApi'
import { reportErrorSaga } from '../app/sagas'
import { actions as authActions } from '../auth'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* registerSaga(action) {
  try {
    yield put(actions.registerStarted())

    const data = action.payload

    const user = yield call(registerApi.register, data)

    yield put(actions.registerSuccess(user))
    yield call(toast, 'Registrado com sucesso', { type: 'success' })
    yield put(
      authActions.attemptLogin({
        username: data.email,
        password: data.password,
      }),
    )
  } catch (error) {
    yield put(actions.registerFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.register, registerSaga)

  yield takeEvery(actions.registerFailed, reportErrorSaga)
}

export default [watchers]
