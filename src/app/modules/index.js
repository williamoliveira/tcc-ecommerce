import injectEntities from './entities'
import injectAuth from './auth'
import injectRegister from './register'
import injectApp from './app'
import injectProducts from './products'
import injectProductGroups from './productGroups'
import injectCart from './cart'
import injectOrders from './orders'
import injectAddresses from './addresses'

export default (store) => {
  injectApp(store)
  injectEntities(store)
  injectAuth(store)
  injectRegister(store)
  injectProducts(store)
  injectProductGroups(store)
  injectCart(store)
  injectOrders(store)
  injectAddresses(store)
}
