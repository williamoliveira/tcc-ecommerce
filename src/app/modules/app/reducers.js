import { createReducer } from 'redux-act-light'
import * as actions from './actions'
import { NAME } from './constants'

// ------------------------------------
// Sync Reducer
// ------------------------------------

export const appKey = `${NAME}`

const getInitialState = () => ({})

export const appReducer = createReducer(
  {
    [actions.setMetadata]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  getInitialState(),
)
