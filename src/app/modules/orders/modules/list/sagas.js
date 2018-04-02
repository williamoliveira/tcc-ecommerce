import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import ordersApi from '../../services/ordersApi'
import { actions as ordersFormUiActions } from '../save'
import * as actions from './actions'
import { reportErrorSaga } from '../../../app/sagas'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyOrdersSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      include: ['roles'],
      ...query,
    }

    const res = yield call(ordersApi.fetchMany, cleanQuery)
    const orders = res.data

    const normalized = normalizeList(orders)
    const pagination = parsePaginationFromResponse(res)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchManySuccess({ orders, normalized, pagination }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

export function* saveOneSuccessSaga() {
  yield put(actions.fetchMany())
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, fetchManyOrdersSaga)
  yield takeLatest(ordersFormUiActions.saveOneSuccess, saveOneSuccessSaga)

  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
}

export default [watchers]
