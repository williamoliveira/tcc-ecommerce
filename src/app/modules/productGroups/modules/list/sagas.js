import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productGroupsApi from '../../services/productGroupsApi'
import * as actions from './actions'
import { reportErrorSaga } from '../../../app/sagas'
import takeLocationChange from '../../../../utils/sagas/takeLocationChange'
import notifyInitialFetch from '../../../app/sagaUtils/notifyInitialFetch'
import putAndWait from '../../../../utils/sagas/putAndWait'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyProductGroupsSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      include: ['sub_groups'],
      ...query,
    }

    const res = yield call(productGroupsApi.fetchMany, cleanQuery)
    const productGroups = res.data

    const normalized = normalizeList(productGroups)
    const pagination = parsePaginationFromResponse(res)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchManySuccess({ productGroups, normalized, pagination }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

export function* saveOneSuccessSaga() {
  yield put(actions.fetchMany())
}

export function* initSaga() {
  yield putAndWait(actions.fetchMany(), actions.fetchManySuccess, actions.fetchManyFailed)
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, fetchManyProductGroupsSaga)
  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
  yield takeLocationChange({ path: '/', exact: true }, notifyInitialFetch(initSaga))
}

export default [watchers]
