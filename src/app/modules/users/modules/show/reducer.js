import camelCase from 'lodash/camelCase'
import { createReducer } from 'redux-act-light'
import parseAxiosError from '../../../../utils/parseAxiosError'
import * as actions from './actions'
import { MODULE_NAME } from './constants'

export const KEY = camelCase(MODULE_NAME)

const initialState = {
  user: null,
  isLoading: false,
  error: false,
}

export default createReducer(
  {
    [actions.fetchOneStarted]: state => ({
      ...state,
      user: null,
      isLoading: true,
      error: null,
    }),

    [actions.fetchOneSuccess]: (state, { payload }) => ({
      ...state,
      user: payload.user,
      isLoading: false,
      error: null,
    }),

    [actions.fetchOneFailed]: (state, { payload }) => ({
      ...state,
      user: null,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),
  },
  initialState,
)
