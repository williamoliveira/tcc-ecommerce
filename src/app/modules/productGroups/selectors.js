import { createSelector } from 'reselect'
import { getEntities } from '../entities/selectors'
import { ProductGroupS } from './constants'
import { denormalizeList, denormalizeSingle } from './schema'

export const getNormalizedProductGroups = state => getEntities(state)[ProductGroupS]

export const getAllIds = createSelector(
  [getNormalizedProductGroups],
  normalizedProductGroups =>
    (normalizedProductGroups ? Object.keys(normalizedProductGroups) : []),
)

export const getAll = createSelector([getEntities, getAllIds], (entities, ids) =>
  denormalizeList(ids, entities),
)

export const getById = createSelector([getEntities, (state, id) => id], (entities, id) =>
  denormalizeSingle(id, entities),
)
