import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import ordersApi from '../../services/ordersApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneOrderSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const cleanQuery = {
      include: ['roles'],
      ...query,
    }

    const res = yield call(ordersApi.fetchById, id, cleanQuery)
    const orders = [res]

    const normalized = normalizeList(orders)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchOneSuccess({ orders, normalized }))
  } catch (error) {
    yield put(actions.fetchOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchOne, fetchOneOrderSaga)
}

export default [watchers]
