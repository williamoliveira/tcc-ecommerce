import appModule from './app'
import authModule from './auth'
import cartModule from './cart'
import entitiesModule from './entities'

export default (store) => {
  store.custom.injectModule('app', appModule)
  store.custom.injectModule('entities', entitiesModule)
  store.custom.injectModule('auth', authModule)
  store.custom.injectModule('cart', cartModule)
}
