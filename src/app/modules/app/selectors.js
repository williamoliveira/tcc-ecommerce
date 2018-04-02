import { appKey } from './reducers'

export const getStateSlice = state => state[appKey]

export const getCompany = state => getStateSlice(state).company

export const getSliders = state => getStateSlice(state).sliders
