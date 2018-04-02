import { call, put, takeLatest } from 'redux-saga/effects'
import addressesApi from '../../services/addressesApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyAddressesSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      // query defaults can come here
      paginate: false,
      ...query,
    }

    const res = yield call(addressesApi.fetchMany, cleanQuery)

    const addresses = res.data

    yield put(actions.fetchManySuccess({ addresses }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, fetchManyAddressesSaga)
}

export default [watchers]
