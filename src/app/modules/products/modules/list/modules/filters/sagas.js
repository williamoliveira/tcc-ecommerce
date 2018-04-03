import isEqual from 'lodash/isEqual'
import qs from 'qs'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import takeLocationChange from '../../../../../../utils/sagas/takeLocationChange'
import { actions as appActions } from '../../../../../app'
import notifyInitialFetch from '../../../../../app/sagaUtils/notifyInitialFetch'
import * as actions from './actions'
import * as selectors from './selectors'
import clean from '../../../../../../utils/objects/clean'

export function fromQueryString(queryString) {
  return qs.parse(queryString.substring(1, queryString.length))
}

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* changeFiltersSaga(action) {
  try {
    yield put(actions.changeFiltersStarted(action.payload))

    const { payload } = action

    const oldFilters = yield select(selectors.getFilters)
    const filters = {
      ...oldFilters,
      ...payload,
    }

    // already normalized
    const normalizedFilters = { ...filters }

    yield put(actions.changeFiltersSuccess({ normalizedFilters, filters, oldFilters }))
  } catch (error) {
    yield put(actions.changeFiltersFailed({ error, action }))
  }
}

export function* locationChangedSaga(action) {
  const search = action.payload.search

  const oldNormalizedFilters = yield select(selectors.getNormalizedFilters)
  const queryStringFilters = yield call(fromQueryString, search)

  const normalizedFilters = {
    search: queryStringFilters.search || '',
    subGroupId: queryStringFilters.cat || null,
  }

  if (!isEqual(oldNormalizedFilters, normalizedFilters)) {
    yield put(actions.changeFiltersStarted(action.payload))
    yield put(actions.changeFiltersSuccess({ normalizedFilters }))
  }
}

export function* updateLocationSearchSaga(action) {
  const normalizedFilters = yield select(selectors.getNormalizedFilters)

  const queryStringFilters = clean({
    search: normalizedFilters.search,
    cat: normalizedFilters.subGroupId,
  })

  yield put(appActions.setLocationSearch({ search: queryStringFilters, merge: false }))
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.changeFilters, changeFiltersSaga)
  yield takeLatest(actions.changeFiltersSuccess, updateLocationSearchSaga)
  yield takeLocationChange('/', locationChangedSaga)
}
