import { call, put, takeLatest } from 'redux-saga/effects'
import ordersApi from '../../services/ordersApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyOrdersSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      // query defaults can come here
      paginate: false,
      ...query,
    }

    const res = yield call(ordersApi.fetchMany, cleanQuery)

    const orders = res.data

    yield put(actions.fetchManySuccess({ orders }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, fetchManyOrdersSaga)
}

export default [watchers]
