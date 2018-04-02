import { injectReducer, injectSaga } from '../../../../../../store/hooks'
import * as actions from './actions'
import * as constants from './constants'
import reducer, { KEY } from './reducer'
import saga from './sagas'
import * as selectors from './selectors'

export { actions, selectors, constants, reducer }

export default (store) => {
  injectReducer(store)(KEY, reducer)
  injectSaga(store)(saga)
}
