import { createReducer } from 'redux-act-light'
import camelCase from 'lodash/camelCase'
import * as action from './actions'
import { MODULE_NAME } from './constants'

export const KEY = camelCase(MODULE_NAME)

// ------------------------------------
// Form Index UI Reducer
// ------------------------------------

const initialState = {
  search: '',
  subGroupId: null,
}

export default createReducer(
  {
    [action.changeFiltersSuccess]: (state, { payload }) => ({
      ...state,
      ...payload.normalizedFilters,
    }),
  },
  initialState,
)
