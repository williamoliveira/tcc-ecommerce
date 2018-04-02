import camelCase from 'lodash/camelCase'
import { createReducer } from 'redux-act-light'
import parseAxiosError from '../../../../utils/parseAxiosError'
import * as actions from './actions'
import { MODULE_NAME } from './constants'

export const KEY = camelCase(MODULE_NAME)

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  users: [],
}

export default createReducer(
  {
    [actions.fetchManyStarted]: (state, { payload }) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    [actions.fetchManyFailed]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),

    [actions.fetchManySuccess]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: null,
      users: payload.users || [],
    }),
  },
  initialState,
)
