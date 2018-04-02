import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import addressesApi from '../../services/addressesApi'
import { actions as addressesFormUiActions } from '../form'
import * as actions from './actions'
import { reportErrorSaga } from '../../../app/sagas'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyAddressesSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      include: ['city', 'city.state'],
      ...query,
    }

    const res = yield call(addressesApi.fetchMany, cleanQuery)
    const addresses = res.data

    const normalized = normalizeList(addresses)
    const pagination = parsePaginationFromResponse(res)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchManySuccess({ addresses, normalized, pagination }))
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
  yield takeLatest(actions.fetchMany, fetchManyAddressesSaga)
  yield takeLatest(addressesFormUiActions.saveOneSuccess, saveOneSuccessSaga)

  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
}

export default [watchers]
