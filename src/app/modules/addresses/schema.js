import { denormalize, normalize, schema } from 'normalizr'
import { MODULE_NAME } from './constants'

const addresseschema = new schema.Entity(MODULE_NAME)
const addressesListSchema = new schema.Array(addresseschema)

const normalizeList = addresses => normalize(addresses, addressesListSchema)
const denormalizeList = (ids, entities) => denormalize(ids, addressesListSchema, entities)
const denormalizeSingle = (id, entities) => denormalize(id, addresseschema, entities)

export {
  addresseschema,
  addressesListSchema,
  normalizeList,
  denormalizeList,
  denormalizeSingle,
}
