import camelCase from 'lodash/camelCase'
import { createReducer } from 'redux-act-light'
import parseAxiosError from '../../../../utils/parseAxiosError'
import * as actions from './actions'
import { MODULE_NAME } from './constants'

export const KEY = camelCase(MODULE_NAME)

const initialState = {
  isLoading: false,
  error: null,
}

export default createReducer(
  {
    [actions.deleteOneStarted]: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    [actions.deleteOneSuccess]: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    [actions.deleteOneFailed]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),
  },
  initialState,
)
