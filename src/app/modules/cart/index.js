import { injectReducer, injectSaga } from '../../store/hooks'
import * as constants from './constants'
import * as selectors from './selectors'
import * as actions from './actions'
import reducer, { KEY } from './reducer'
import sagas from './sagas'

export { selectors, constants, actions }

export default (store) => {
  injectReducer(store)(KEY, reducer)
  injectSaga(store)(sagas)
}
