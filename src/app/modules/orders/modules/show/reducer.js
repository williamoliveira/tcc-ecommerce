import parseAxiosError from '../../../../utils/parseAxiosError'
import { createReducer } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import * as actions from './actions'
import { SUB_MODULE_NAME } from './constants'

export const KEY = `${MODULE_NAME}${SUB_MODULE_NAME}`

const initialState = {
  order: null,
  isLoading: false,
  error: false,
}

export default createReducer(
  {
    [actions.fetchOneStarted]: state => ({
      ...state,
      order: null,
      isLoading: true,
      error: null,
    }),

    [actions.fetchOneSuccess]: (state, { payload }) => ({
      ...state,
      order: payload.order,
      isLoading: false,
      error: null,
    }),

    [actions.fetchOneFailed]: (state, { payload }) => ({
      ...state,
      order: null,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),
  },
  initialState,
)
