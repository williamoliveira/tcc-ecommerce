import { createSelector } from 'reselect'
import { entitiesKey } from './reducers'

const proxy = state =>
  new Proxy(state, {
    get(obj, prop) {
      return prop in obj ? obj[prop] : {}
    },
  })

const getStateSlice = state => state[entitiesKey]

export const getEntities = createSelector([getStateSlice], state => state || {})
