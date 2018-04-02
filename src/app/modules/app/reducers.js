import { createReducer } from 'redux-act-light'
import * as actions from './actions'
import { NAME } from './constants'

// ------------------------------------
// Sync Reducer
// ------------------------------------

export const appKey = `${NAME}`

const initialState = {
  company: null,
  sliders: [],
}

export const appReducer = createReducer(
  {
    [actions.setMetadata]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [actions.fetchCompanySuccess]: (state, { payload }) => ({
      ...state,
      company: payload,
    }),
    [actions.fetchSlidersSuccess]: (state, { payload }) => ({
      ...state,
      sliders: payload,
    }),
  },
  initialState,
)
