import { createReducer } from 'redux-act-light'
import find from 'lodash/find'
import * as actions from './actions'
import { MODULE_NAME } from './constants'
import parseAxiosError from '../../utils/parseAxiosError'

export const KEY = MODULE_NAME

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  items: [],
  address: null,
  isLoading: false,
  error: null,
}

export const reducer = createReducer(
  {
    [actions.addItem]: (state, { payload }) => ({
      ...state,
      items: [...state.items, payload],
    }),

    [actions.setAddress]: (state, { payload }) => ({
      ...state,
      address: payload,
    }),

    [actions.removeItemByProductId]: (state, { payload }) => ({
      ...state,
      items: state.items.filter(item => item.product.id !== payload),
    }),

    [actions.setItemQuantityByProductId]: (state, { payload }) => {
      const item = find(state.items, i => i.product.id === payload.productId)
      if (!item) return state
      const itemIndex = state.items.indexOf(item)

      return {
        ...state,
        items: [
          ...state.items.slice(0, itemIndex),
          { ...item, quantity: payload.quantity },
          ...state.items.slice(itemIndex + 1),
        ],
      }
    },

    [actions.reset]: () => ({ ...initialState }),

    [actions.completeOrderStarted]: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    [actions.completeOrderSuccess]: state => ({
      ...state,
      isLoading: false,
    }),

    [actions.completeOrderFailed]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),
  },
  initialState,
)

export default reducer
