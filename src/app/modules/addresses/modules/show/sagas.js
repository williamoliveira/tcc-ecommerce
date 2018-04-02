import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import addressesApi from '../../services/addressesApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneAddressesSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const cleanQuery = {
      include: ['city', 'city.state'],
      ...query,
    }

    const res = yield call(addressesApi.fetchById, id, cleanQuery)
    const addresses = [res]

    const normalized = normalizeList(addresses)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchOneSuccess({ addresses, normalized }))
  } catch (error) {
    yield put(actions.fetchOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchOne, fetchOneAddressesSaga)
}

export default [watchers]
