import { call, put, takeLatest, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import * as actions from './actions'
import * as selectors from './selectors'
import { actions as ordersActions } from '../orders/modules/save'
import putAndWait from '../../utils/sagas/putAndWait'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* completeOrderSaga(action) {
  try {
    yield put(actions.completeOrderStarted())

    const order = yield select(selectors.getCart)

    yield putAndWait(
      ordersActions.createOne({ order }),
      ordersActions.createOneSuccess,
      ordersActions.createOneFailed,
    )

    yield put(actions.reset())

    yield put(push('/checkout/completed'))

    yield put(actions.completeOrderSuccess({ order }))
  } catch (error) {
    yield put(actions.completeOrderFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.completeOrder, completeOrderSaga)
}
