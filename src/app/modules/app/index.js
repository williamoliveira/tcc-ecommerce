import * as actions from './actions'
import * as reducers from './reducers'
import * as constants from './constants'
import * as selectors from './selectors'

import sagas from './sagas'

export { actions, reducers, constants, sagas, selectors }

export default (store) => {
  store.custom.injectReducer(reducers.appKey, reducers.appReducer)
  store.custom.injectSaga(sagas)
}
