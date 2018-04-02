import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../../../resources/user/schema'
import usersApi from '../../../../resources/user/apiAuthedSaga'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneUserSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const cleanQuery = {
      include: ['roles'],
      ...query,
    }

    const res = yield call(usersApi.fetchById, id, cleanQuery)
    const users = [res]

    const normalized = normalizeList(users)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchOneSuccess({ users, normalized }))
  } catch (error) {
    yield put(actions.fetchOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.fetchOne, fetchOneUserSaga)
}
