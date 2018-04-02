import { injectReducer, injectSaga } from '../../../../store/hooks'
import * as actions from './actions'
import * as constants from './constants'
import reducer, { KEY } from './reducer'
import sagas from './sagas'
import * as selectors from './selectors'
import injectModules from './modules'

export { actions, constants, sagas, selectors, reducer }

export default (store) => {
  injectModules(store)
  injectReducer(store)(KEY, reducer)
  injectSaga(store)(sagas)
}
