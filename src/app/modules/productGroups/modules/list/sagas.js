import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { reportErrorSaga } from '../../../app/sagas'
import notifyInitialFetch from '../../../app/sagaUtils/notifyInitialFetch'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productGroupsApi from '../../services/productGroupsApi'
import * as actions from './actions'
import * as selectors from './selectors'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyProductGroupsSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const delay = yield select(state => state.app.fetchDelay)

    const cleanQuery = {
      include: ['sub_groups'],
      delay,
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

export function initialFetchHandler(saga) {
  return notifyInitialFetch(function* (action) {
    if (!action.payload.isInitialFetch) {
      yield call(saga, action)
      return
    }

    if (yield select(selectors.getDidInitialFetch)) return
    yield call(saga, action)
    yield put(actions.initialFetchDone())
  })
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, initialFetchHandler(fetchManyProductGroupsSaga))
  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
}

export default [watchers]
