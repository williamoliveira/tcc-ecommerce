/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { MODULE_NAME } from './constants'

export const changeFilters = createAction(`${MODULE_NAME}/CHANGE_FILTERS`)
export const changeFiltersStarted = createAction(`${MODULE_NAME}/CHANGE_FILTERS_STARTED`)
export const changeFiltersSuccess = createAction(`${MODULE_NAME}/CHANGE_FILTERS_SUCCESS`)
export const changeFiltersFailed = createAction(`${MODULE_NAME}/CHANGE_FILTERS_FAILED`)
