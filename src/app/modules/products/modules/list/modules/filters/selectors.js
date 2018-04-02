import { KEY } from './reducer'

export const getStateSlice = state => state[KEY]

export const getNormalizedFilters = getStateSlice

export const getFilters = getStateSlice
