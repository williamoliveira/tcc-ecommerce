import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import ordersApi from '../../services/ordersApi'
import * as actions from './actions'
import { actions as ordersFormUiActions } from '.'

export const formatToApi = order => ({
  items: order.items.map(item => ({
    product_id: item.product.id,
    quantity: parseInt(item.quantity, 10),
  })),
  address_id: order.address.id,
})

export function* createOneOrderSaga(action) {
  try {
    yield put(actions.createOneStarted())

    const { order } = action.payload

    const formattedOrder = yield call(formatToApi, order)
    const serverOrder = yield call(ordersApi.create, formattedOrder)
    const orders = [serverOrder]

    const normalized = yield call(normalizeList, orders)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.createOneSuccess({ orders, normalized }))
  } catch (error) {
    yield put(actions.createOneFailed({ error, action }))
  }
}

export function* updateOneOrderSaga(action) {
  try {
    yield put(actions.updateOneStarted())

    const { id, order } = action.payload

    const formattedOrder = yield call(formatToApi, order)
    const serverOrder = yield call(ordersApi.updateById, id, formattedOrder)
    const orders = [serverOrder]

    const normalized = yield call(normalizeList, orders)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.updateOneSuccess({ orders, normalized }))
  } catch (error) {
    yield put(actions.updateOneFailed({ error, action }))
  }
}

export function* saveOneOrderSaga(action) {
  try {
    yield put(actions.saveOneStarted())

    const { order, order: { id } } = action.payload

    yield put(id ? actions.updateOne({ id, order }) : actions.createOne({ order }))

    // TODO handle this, currently always success
    yield put(actions.saveOneSuccess())
  } catch (error) {
    yield put(actions.saveOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(ordersFormUiActions.saveOne, saveOneOrderSaga)
  yield takeLatest(ordersFormUiActions.createOne, createOneOrderSaga)
  yield takeLatest(ordersFormUiActions.updateOne, updateOneOrderSaga)
}
