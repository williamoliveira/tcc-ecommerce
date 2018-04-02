import * as constants from './constants'
import injectFilter from './modules/filter'
import injectList from './modules/list'
import injectShow from './modules/show'
import * as selectors from './selectors'

export { selectors, constants }

export default (store) => {
  injectList(store)
  injectFilter(store)
  injectShow(store)
}
