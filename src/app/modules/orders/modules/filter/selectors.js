import { createSelector } from 'reselect'
import { KEY } from './reducer'

export const getStateSlice = state => state[KEY] || {}

export const getOrders = state => getStateSlice(state).orders

export const getIsLoading = state => getStateSlice(state).isLoading

export const getError = state => getStateSlice(state).error
