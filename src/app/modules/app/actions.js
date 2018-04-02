/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { NAME } from './constants'

export const setMetadata = createAction(`${NAME}/SET_METADATA`)

export const beforeAppStart = createAction(`${NAME}/BEFORE_APP_START`)
export const beforeAppStartDone = createAction(`${NAME}/BEFORE_APP_START_DONE`)

export const appStarted = createAction(`${NAME}/APP_STARTED`)
export const ready = createAction(`${NAME}/READY`)

export const startRehydration = createAction(`${NAME}/START_REHYDRATION`)
export const rehydrationDone = createAction(`${NAME}/REHYDRATION_DONE`)

export const error = createAction(`${NAME}/ERROR`)

export const initialFetchStarted = createAction(`${NAME}/INITIAL_FETCH_STARTED`)
export const initialFetchSuccess = createAction(`${NAME}/INITIAL_FETCH_SUCCESS`)
export const initialFetchFailed = createAction(`${NAME}/INITIAL_FETCH_FAILED`)

export const setLocationSearch = createAction(`${NAME}/SET_LOCATION_SEARCH`)

export const showNotification = createAction(`${NAME}/SHOW_NOTIFICATION`)
export const showToast = createAction(`${NAME}/SHOW_TOAST`)

export const fetchCompany = createAction(`${NAME}/FETCH_COMPANY`)
export const fetchCompanyStarted = createAction(`${NAME}/FETCH_COMPANY_STARTED`)
export const fetchCompanySuccess = createAction(`${NAME}/FETCH_COMPANY_SUCCESS`)
export const fetchCompanyFailed = createAction(`${NAME}/FETCH_COMPANY_FAILED`)

export const fetchSliders = createAction(`${NAME}/FETCH_SLIDERS`)
export const fetchSlidersStarted = createAction(`${NAME}/FETCH_SLIDERS_STARTED`)
export const fetchSlidersSuccess = createAction(`${NAME}/FETCH_SLIDERS_SUCCESS`)
export const fetchSlidersFailed = createAction(`${NAME}/FETCH_SLIDERS_FAILED`)
