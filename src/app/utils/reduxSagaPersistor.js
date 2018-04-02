/* eslint-disable func-names */
import assignDeep from 'assign-deep'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import throttle from 'lodash/throttle'
import deepEqual from 'fast-deep-equal'
import { select, call, all, put } from 'redux-saga/effects'

export const REHYDRATE = 'reduxSagaPersistor/REHYDRATE'

export const rehydrate = payload => ({
  type: REHYDRATE,
  payload,
})

export const deepMergeReconciler = (oldState, newState) =>
  assignDeep({}, oldState, newState)
export const mergeReconciler = (oldState, newState) => ({
  ...oldState,
  ...newState,
})
export const defaultReconciler = mergeReconciler

const serializer = JSON.stringify
const deserializer = JSON.parse

export const autoRehydrate = (options, baseReducer) => (state, action) => {
  const {
    key,
    reconciler = defaultReconciler,
    rehydratedFlagKey = '_rehydrated',
  } = options

  let newState = state

  if (action.type === REHYDRATE && !state[rehydratedFlagKey]) {
    newState = {
      [rehydratedFlagKey]: true,
      ...reconciler(state, action.payload[key]),
    }
  }

  return baseReducer(newState, action)
}

export const createPersistStateSaga = (options) => {
  const {
    storage, key, whitelist, selector,
  } = options

  const setItems = throttle(
    (k, v) => storage.setItem.bind(storage)(k, serializer(v)),
    700,
  )

  let lastState
  let lastPersistedValue

  return function* () {
    const state = yield select(selector)

    if (state === lastState) return
    lastState = state

    const value = whitelist ? pick(state, whitelist) : state

    if (deepEqual(value, lastPersistedValue)) return
    lastPersistedValue = value

    yield call(setItems, key, value)
  }
}

export const createRehydrateStateSaga = ({ storage }) =>
  function* () {
    const getAllKeys = storage.getAllKeys.bind(storage)
    const getItem = key =>
      storage.getItem
        .bind(storage)(key)
        .then(deserializer)

    const keys = yield call(getAllKeys)
    const values = yield all(keys.map(key => call(getItem, key)))
    const state = yield call(zipObject, keys, values)

    yield put(rehydrate(state))
  }
