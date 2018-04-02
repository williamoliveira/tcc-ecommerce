import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../../../resources/user/schema'
import usersApi from '../../../../resources/user/apiAuthedSaga'
import { actions as usersFormUiActions } from '../form'
import * as actions from './actions'
import { reportErrorSaga } from '../../../app/sagas'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyUsersSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      include: ['roles'],
      ...query,
    }

    const res = yield call(usersApi.fetchMany, cleanQuery)
    const users = res.data

    const normalized = normalizeList(users)
    const pagination = parsePaginationFromResponse(res)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchManySuccess({ users, normalized, pagination }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

export function* saveOneSuccessSaga() {
  yield put(actions.fetchMany())
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.fetchMany, fetchManyUsersSaga)
  yield takeLatest(usersFormUiActions.saveOneSuccess, saveOneSuccessSaga)

  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
}
