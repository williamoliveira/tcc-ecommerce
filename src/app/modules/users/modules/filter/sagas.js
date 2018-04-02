import { call, put, takeLatest } from 'redux-saga/effects'
import usersApi from '../../../../resources/user/apiAuthedSaga'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyUsersSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      // query defaults can come here
      paginate: false,
      ...query,
    }

    const res = yield call(usersApi.fetchMany, cleanQuery)

    const users = res.data

    yield put(actions.fetchManySuccess({ users }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.fetchMany, fetchManyUsersSaga)
}
