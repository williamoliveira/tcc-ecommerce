import { createSelector } from 'reselect'
import { getEntities } from '../entities/selectors'
import { ENITY_NAME } from '../../resources/user/constants'
import { denormalizeList, denormalizeSingle } from '../../resources/user/schema'

export const getNormalizedUsers = state => getEntities(state)[ENITY_NAME]

export const getAllIds = createSelector(
  [getNormalizedUsers],
  normalizedUsers => (normalizedUsers ? Object.keys(normalizedUsers) : []),
)

export const getAll = createSelector([getEntities, getAllIds], (entities, ids) =>
  denormalizeList(ids, entities),
)

export const getById = createSelector([getEntities, (state, id) => id], (entities, id) =>
  denormalizeSingle(id, entities),
)
