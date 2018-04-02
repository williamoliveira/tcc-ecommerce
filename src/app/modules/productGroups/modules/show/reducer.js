import parseAxiosError from '../../../../utils/parseAxiosError'
import { createReducer } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import * as actions from './actions'
import { SUB_MODULE_NAME } from './constants'

export const KEY = `${MODULE_NAME}${SUB_MODULE_NAME}`

const initialState = {
  productGroup: null,
  isLoading: false,
  error: false,
}

export default createReducer(
  {
    [actions.fetchOneStarted]: state => ({
      ...state,
      productGroup: null,
      isLoading: true,
      error: null,
    }),

    [actions.fetchOneSuccess]: (state, { payload }) => ({
      ...state,
      productGroup: payload.productGroup,
      isLoading: false,
      error: null,
    }),

    [actions.fetchOneFailed]: (state, { payload }) => ({
      ...state,
      productGroup: null,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),
  },
  initialState,
)
