import { KEY } from './reducers'

export const getStateSlice = state => state[KEY]

export const getError = state => getStateSlice(state).error

export const getIsLoading = state => getStateSlice(state).isLoading
