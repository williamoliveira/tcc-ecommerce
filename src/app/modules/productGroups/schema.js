import { denormalize, normalize, schema } from 'normalizr'
import { MODULE_NAME } from './constants'

const productGroupSchema = new schema.Entity(MODULE_NAME)
const productGroupsListSchema = new schema.Array(productGroupSchema)

const normalizeList = productGroups => normalize(productGroups, productGroupsListSchema)
const denormalizeList = (ids, entities) =>
  denormalize(ids, productGroupsListSchema, entities)
const denormalizeSingle = (id, entities) => denormalize(id, productGroupSchema, entities)

export {
  productGroupSchema,
  productGroupsListSchema,
  normalizeList,
  denormalizeList,
  denormalizeSingle,
}
