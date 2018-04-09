import * as constants from './constants'
import injectFilter from './modules/filter'
import injectList from './modules/list'
import * as selectors from './selectors'

export { selectors, constants }

export default (store) => {
  injectList(store)
  injectFilter(store)
}
