import { createReducer } from 'redux-act-light'
import * as actions from './actions'
import { NAME } from './constants'

// ------------------------------------
// Sync Reducer
// ------------------------------------

export const appKey = `${NAME}`

const initialState = {
  fetchDelay: 0,
  resultsRepeat: 1,
}

export const appReducer = createReducer(
  {
    [actions.setMetadata]: (state, { payload }) => ({
      ...state,
      fetchDelay: payload.fetchDelay ? parseInt(payload.fetchDelay, 10) : 0,
      resultsRepeat: payload.resultsRepeat ? parseInt(payload.resultsRepeat, 10) : 1,
    }),
  },
  initialState,
)
