import { call, put, takeLatest } from 'redux-saga/effects'
import ordersApi from '../../services/ordersApi'
import * as actions from './actions'

export function* deleteOneOrderSaga(action) {
  try {
    yield put(actions.deleteOneStarted())

    const { id, order } = action.payload

    yield call(ordersApi.deleteById, id || order.id)

    // TODO delete locally

    yield put(actions.deleteOneSuccess({ order }))
  } catch (error) {
    yield put(actions.deleteOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.deleteOne, deleteOneOrderSaga)
}

export default [watchers]
