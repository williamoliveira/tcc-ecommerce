import identity from 'lodash/identity'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../../../resources/user/schema'
import usersApi from '../../../../resources/user/apiAuthedSaga'
import * as actions from './actions'
import { actions as usersFormUiActions } from '.'

export const formatToApi = user => ({
  ...pickBy(pick(user, ['id', 'name', 'password', 'email']), identity),
  ...pick(user, ['roles']),
})

export function* createOneUserSaga(action) {
  try {
    yield put(actions.createOneStarted())

    const { user } = action.payload

    const formattedUser = formatToApi(user)
    const serverUser = yield call(usersApi.create, formattedUser)
    const users = [serverUser]

    const normalized = normalizeList(users)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.createOneSuccess({ users, normalized }))
  } catch (error) {
    yield put(actions.createOneFailed({ error, action }))
  }
}

export function* updateOneUserSaga(action) {
  try {
    yield put(actions.updateOneStarted())

    const { id, user } = action.payload

    const formattedUser = formatToApi(user)
    const serverUser = yield call(usersApi.updateById, id, formattedUser)
    const users = [serverUser]

    const normalized = normalizeList(users)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.updateOneSuccess({ users, normalized }))
  } catch (error) {
    yield put(actions.updateOneFailed({ error, action }))
  }
}

export function* saveOneUserSaga(action) {
  try {
    yield put(actions.saveOneStarted())

    const { user, user: { id } } = action.payload

    yield put(id ? actions.updateOne({ id, user }) : actions.createOne({ user }))

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
  yield takeLatest(usersFormUiActions.saveOne, saveOneUserSaga)
  yield takeLatest(usersFormUiActions.createOne, createOneUserSaga)
  yield takeLatest(usersFormUiActions.updateOne, updateOneUserSaga)
}
