import Loadable from '@7rulnik/react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "account-address-list" */ './ListContainer'),
  loading: () => null,
})
