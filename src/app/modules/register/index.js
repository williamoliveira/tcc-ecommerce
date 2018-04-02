import { injectReducer, injectSagas } from '../../store/hooks'
import * as actions from './actions'
import reducer, { KEY } from './reducers'
import * as constants from './constants'
import * as selectors from './selectors'
import sagas from './sagas'

export { actions, reducer, constants, selectors }

export default (store) => {
  injectReducer(store)(KEY, reducer)
  injectSagas(store)(sagas)
}
