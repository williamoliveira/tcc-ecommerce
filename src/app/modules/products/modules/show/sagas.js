import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productsApi from '../../services/productsApi'
import * as actions from './actions'
import putAndWait from '../../../../utils/sagas/putAndWait'
import notifyInitialFetch from '../../../app/sagaUtils/notifyInitialFetch'
import takeLocationChange from '../../../../utils/sagas/takeLocationChange'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneProductSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const cleanQuery = {
      include: ['group', 'sub_group'],
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

export function* initSaga(action, { match }) {
  yield putAndWait(
    actions.fetchOne({ id: match.params.id }),
    actions.fetchOneSuccess,
    actions.fetchOneFailed,
  )
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchOne, fetchOneProductSaga)
  yield takeLocationChange({ path: '/:id', exact: true }, notifyInitialFetch(initSaga))
}

export default [watchers]
