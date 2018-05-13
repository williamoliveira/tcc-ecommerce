import { call, put, takeLatest, takeEvery, select, throttle } from 'redux-saga/effects'
import defaultsDeep from 'lodash/fp/defaultsDeep'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productsApi from '../../services/productsApi'
import * as actions from './actions'
import * as selectors from './selectors'
import { reportErrorSaga } from '../../../app/sagas'
import {
  selectors as filtersSelectors,
  actions as filtersActions,
} from './modules/filters'
import clean from '../../../../utils/objects/clean'
import notifyInitialFetch from '../../../app/sagaUtils/notifyInitialFetch'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyProductsSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query: payloadQuery } = action.payload || {}

    const normalizedFilters = yield select(filtersSelectors.getNormalizedFilters)

    const query = defaultsDeep(payloadQuery, {
      where: clean({
        product_sub_group_id: normalizedFilters.subGroupId,
        name: { search: normalizedFilters.search },
      }),
    })

    const res = yield call(productsApi.fetchMany, query)
    const products = res.data

    const normalized = normalizeList(products)
    const pagination = parsePaginationFromResponse(res)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchManySuccess({ products, normalized, pagination }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

export function* changeFiltersSuccessSaga() {
  yield put(actions.fetchMany())
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
export default function* () {
  console.log('products sagas loaded')
  yield takeLatest(actions.fetchMany, initialFetchHandler(fetchManyProductsSaga))
  yield throttle(1000, filtersActions.changeFiltersSuccess, changeFiltersSuccessSaga)
  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
}
