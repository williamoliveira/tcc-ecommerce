import { createSelector } from 'reselect'
import { getEntities } from '../entities/selectors'
import { KEY } from './reducer'

export const getStateSlice = state => state[KEY] || {}

export const getCart = createSelector([getStateSlice], ({ items = [], ...state }) => {
  const itemsWithSubtotal = items.map(item => ({
    ...item,
    subtotal: item.product.price * item.quantity,
  }))
  return {
    ...state,
    items: itemsWithSubtotal,
    count: items.length,
    subtotal: items.length
      ? itemsWithSubtotal.reduce((subtotal, item) => subtotal + item.subtotal, 0)
      : 0.0,
  }
})

export const getIsLoading = state => getStateSlice(state).isLoading
export const getError = state => getStateSlice(state).error
