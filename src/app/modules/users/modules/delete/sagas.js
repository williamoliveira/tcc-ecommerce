import { call, put, takeLatest } from 'redux-saga/effects'
import usersApi from '../../../../resources/user/apiAuthedSaga'
import * as actions from './actions'

export function* deleteOneUserSaga(action) {
  try {
    yield put(actions.deleteOneStarted())

    const { id, user } = action.payload

    yield call(usersApi.deleteById, id || user.id)

    // TODO delete locally

    yield put(actions.deleteOneSuccess({ user }))
  } catch (error) {
    yield put(actions.deleteOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.deleteOne, deleteOneUserSaga)
}
