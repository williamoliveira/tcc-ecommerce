import { denormalize, normalize, schema } from 'normalizr'
import { ENTITY_NAME } from './constants'

const userSchema = new schema.Entity(ENTITY_NAME)
const usersListSchema = new schema.Array(userSchema)

const normalizeList = users => normalize(users, usersListSchema)
const denormalizeList = (ids, entities) => denormalize(ids, usersListSchema, entities)
const denormalizeSingle = (id, entities) => denormalize(id, userSchema, entities)

export { userSchema, usersListSchema, normalizeList, denormalizeList, denormalizeSingle }
