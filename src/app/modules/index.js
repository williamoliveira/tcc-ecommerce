import injectEntities from './entities'
import injectAuth from './auth'
import injectApp from './app'
import injectCart from './cart'

export default (store) => {
  injectApp(store)
  injectEntities(store)
  injectAuth(store)
  injectCart(store)
}
