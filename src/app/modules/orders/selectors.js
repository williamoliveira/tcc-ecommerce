import { createSelector } from 'reselect'
import { getEntities } from '../entities/selectors'
import { ENTITY_NAME } from './constants'
import { denormalizeList, denormalizeSingle } from './schema'

export const getNormalizedOrders = state => getEntities(state)[ENTITY_NAME]

export const getAllIds = createSelector(
  [getNormalizedOrders],
  normalizedOrders => (normalizedOrders ? Object.keys(normalizedOrders) : []),
)

export const getAll = createSelector([getEntities, getAllIds], (entities, ids) =>
  denormalizeList(ids, entities),
)

export const getById = createSelector([getEntities, (state, id) => id], (entities, id) =>
  denormalizeSingle(id, entities),
)
