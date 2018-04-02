import { call, put, takeLatest } from 'redux-saga/effects'
import addressesApi from '../../services/addressesApi'
import * as actions from './actions'

export function* deleteOneAddressesaga(action) {
  try {
    yield put(actions.deleteOneStarted())

    const { id, address } = action.payload

    yield call(addressesApi.deleteById, id || address.id)

    // TODO delete locally

    yield put(actions.deleteOneSuccess({ address }))
  } catch (error) {
    yield put(actions.deleteOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.deleteOne, deleteOneAddressesaga)
}

export default [watchers]
