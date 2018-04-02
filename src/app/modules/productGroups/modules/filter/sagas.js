import { call, put, takeLatest } from 'redux-saga/effects'
import productGroupsApi from '../../services/productGroupsApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyProductGroupsSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      // query defaults can come here
      paginate: false,
      ...query,
    }

    const res = yield call(productGroupsApi.fetchMany, cleanQuery)

    const productGroups = res.data

    yield put(actions.fetchManySuccess({ productGroups }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, fetchManyProductGroupsSaga)
}

export default [watchers]
