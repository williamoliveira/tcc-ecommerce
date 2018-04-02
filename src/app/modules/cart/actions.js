import { createAction } from 'redux-act-light'
import { MODULE_NAME } from './constants'

const NAME = MODULE_NAME

export const addItem = createAction(`${NAME}/ADD_ITEM`)
export const setAddress = createAction(`${NAME}/SET_ADDRESS`)
export const removeItemByProductId = createAction(`${NAME}/REMOVE_ITEM_BY_PRODUCT_ID`)
export const setItemQuantityByProductId = createAction(
  `${NAME}/SET_ITEM_QUANTITY_BY_PRODUCT_ID`,
)
export const reset = createAction(`${NAME}/RESET`)

export const completeOrder = createAction(`${NAME}/COMPLETE_ORDER`)
export const completeOrderStarted = createAction(`${NAME}/COMPLETE_ORDER_STARTED`)
export const completeOrderSuccess = createAction(`${NAME}/COMPLETE_ORDER_SUCCESS`)
export const completeOrderFailed = createAction(`${NAME}/COMPLETE_ORDER_FAILED`)
