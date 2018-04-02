import { createReducer } from 'redux-act-light'
import * as actions from './actions'
import { NAME } from './constants'
import parseAxiosError from '../../utils/parseAxiosError'

// ------------------------------------
// Auth Entity Reducer
// ------------------------------------
export const KEY = NAME

const initialState = {
  isLoading: false,
  error: null,
}

export default createReducer(
  {
    [actions.registerSuccess]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: false,
    }),

    [actions.registerFailed]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),
  },
  initialState,
)
