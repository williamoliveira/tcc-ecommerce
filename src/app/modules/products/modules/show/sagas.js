import { call, put, select, takeLatest } from 'redux-saga/effects'
import notifyInitialFetch from '../../../app/sagaUtils/notifyInitialFetch'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productsApi from '../../services/productsApi'
import * as actions from './actions'
import * as selectors from './selectors'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneProductSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const delay = yield select(state => state.app.fetchDelay)

    const cleanQuery = {
      include: ['group', 'sub_group'],
      delay,
      ...query,
    }

    const res = yield call(productsApi.fetchById, id, cleanQuery)
    const products = [res.data]

    const normalized = normalizeList(products)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchOneSuccess({ products, normalized }))
  } catch (error) {
    yield put(actions.fetchOneFailed({ error, action }))
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
export default function* () {
  yield takeLatest(actions.fetchOne, initialFetchHandler(fetchOneProductSaga))
}
