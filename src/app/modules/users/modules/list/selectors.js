import { createSelector } from 'reselect'
import { getEntities } from '../../../entities/selectors'
import { denormalizeList } from '../../../../resources/user/schema'
import { KEY } from './reducer'

export const getStateSlice = state => state[KEY] || {}

const getCurrentPageIds = state => getStateSlice(state).currentPageIds

export const getCurrentPageUsers = createSelector(
  [getEntities, getCurrentPageIds],
  (entities, userIds) => denormalizeList(userIds, entities),
)

export const getPagination = state => getStateSlice(state).pagination

export const getIsLoading = state => getStateSlice(state).isLoading

export const getError = state => getStateSlice(state).error
