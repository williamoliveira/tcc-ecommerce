import Loadable from '@7rulnik/react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "account" */ './AccountContainer'),
  loading: () => null,
})
