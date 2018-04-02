import injectEntities from './entities'
import injectAuth from './auth'
import injectUsers from './users'
import injectApp from './app'

export default (store) => {
  injectApp(store)
  injectEntities(store)
  injectAuth(store)
  injectUsers(store)
}
