export const injectSaga = store => (saga) => {
  store.custom.sagas.push(saga)
  return saga
}

export const makeStartSagas = store => () => {
  store.custom.runningTasks = []
  return store.custom.sagas.map((saga) => {
    const task = store.custom.runSaga(saga)
    store.custom.runningTasks.push(task)
    return task
  })
}

export const injectSagas = store => (sagas) => {
  if (!Array.isArray(sagas)) return injectSaga(store)(sagas)
  return sagas.map(injectSaga(store))
}
