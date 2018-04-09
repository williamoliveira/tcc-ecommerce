import { createSelector } from 'reselect'
import { KEY } from './reducer'

export const getStateSlice = state => state[KEY] || {}

export const getDidInitialFetch = state => getStateSlice(state).didInitialFetch

export const getProduct = state => getStateSlice(state).product

export const getIsLoading = state => getStateSlice(state).isLoading

export const getError = state => getStateSlice(state).error
