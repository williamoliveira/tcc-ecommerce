import { denormalize, normalize, schema } from 'normalizr'
import { MODULE_NAME } from './constants'

const orderSchema = new schema.Entity(MODULE_NAME)
const ordersListSchema = new schema.Array(orderSchema)

const normalizeList = orders => normalize(orders, ordersListSchema)
const denormalizeList = (ids, entities) => denormalize(ids, ordersListSchema, entities)
const denormalizeSingle = (id, entities) => denormalize(id, orderSchema, entities)

export {
  orderSchema,
  ordersListSchema,
  normalizeList,
  denormalizeList,
  denormalizeSingle,
}
