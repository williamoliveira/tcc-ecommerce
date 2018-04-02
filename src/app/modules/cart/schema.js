import { denormalize, normalize, schema } from 'normalizr'
import { MODULE_NAME } from './constants'
import { productSchema } from '../products/schema'

const orderItemSchema = new schema.Entity(MODULE_NAME, { product: productSchema })
const orderItemsListSchema = new schema.Array(orderItemSchema)

const normalizeList = orderItems => normalize(orderItems, orderItemsListSchema)
const denormalizeList = (ids, entities) =>
  denormalize(ids, orderItemsListSchema, entities)
const denormalizeSingle = (id, entities) => denormalize(id, orderItemSchema, entities)

export {
  orderItemSchema,
  orderItemsListSchema,
  normalizeList,
  denormalizeList,
  denormalizeSingle,
}
