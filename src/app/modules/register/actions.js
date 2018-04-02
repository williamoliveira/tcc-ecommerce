/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { NAME } from './constants'

export const register = createAction(`${NAME}/REGISTER`)
export const registerStarted = createAction(`${NAME}/REGISTER_STARTED`)
export const registerSuccess = createAction(`${NAME}/REGISTER_SUCCESS`)
export const registerFailed = createAction(`${NAME}/REGISTER_FAILED`)
