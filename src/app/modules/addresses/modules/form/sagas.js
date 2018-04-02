import pick from 'lodash/pick'
import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import addressesApi from '../../services/addressesApi'
import * as actions from './actions'
import { actions as addressesFormUiActions } from '.'

export const formatToApi = address => ({
  ...pick(address, ['id', 'address', 'number', 'zipcode', 'district']),
  city_id: address.city.id,
})

export function* createOneAddressesaga(action) {
  try {
    yield put(actions.createOneStarted())

    const { address } = action.payload

    const formattedAddress = formatToApi(address)
    const serverAddress = yield call(addressesApi.create, formattedAddress)
    const addresses = [serverAddress]

    const normalized = normalizeList(addresses)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.createOneSuccess({ addresses, normalized }))
  } catch (error) {
    yield put(actions.createOneFailed({ error, action }))
  }
}

export function* updateOneAddressesaga(action) {
  try {
    yield put(actions.updateOneStarted())

    const { id, address } = action.payload

    const formattedAddress = formatToApi(address)
    const serverAddress = yield call(addressesApi.updateById, id, formattedAddress)
    const addresses = [serverAddress]

    const normalized = normalizeList(addresses)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.updateOneSuccess({ addresses, normalized }))
  } catch (error) {
    yield put(actions.updateOneFailed({ error, action }))
  }
}

export function* saveOneAddressesaga(action) {
  try {
    yield put(actions.saveOneStarted())

    const { address, address: { id } } = action.payload

    yield put(id ? actions.updateOne({ id, address }) : actions.createOne({ address }))

    // TODO handle this, currently always success
    yield put(actions.saveOneSuccess())
  } catch (error) {
    yield put(actions.saveOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(addressesFormUiActions.saveOne, saveOneAddressesaga)
  yield takeLatest(addressesFormUiActions.createOne, createOneAddressesaga)
  yield takeLatest(addressesFormUiActions.updateOne, updateOneAddressesaga)
}

export default [watchers]
