import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productGroupsApi from '../../services/productGroupsApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneProductGroupSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const cleanQuery = {
      ...query,
    }

    const res = yield call(productGroupsApi.fetchById, id, cleanQuery)
    const productGroups = [res]

    const normalized = normalizeList(productGroups)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchOneSuccess({ productGroups, normalized }))
  } catch (error) {
    yield put(actions.fetchOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchOne, fetchOneProductGroupSaga)
}

export default [watchers]
