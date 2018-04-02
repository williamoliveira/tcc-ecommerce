import { injectReducer, injectSaga } from '../../store/hooks'
import * as actions from './actions'
import * as reducers from './reducers'
import * as constants from './constants'
import * as selectors from './selectors'

import sagas from './sagas'

export { actions, reducers, constants, sagas, selectors }

export default (store) => {
  injectReducer(store)(reducers.appKey, reducers.appReducer)
  injectSaga(store)(sagas)
}
