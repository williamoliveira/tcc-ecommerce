import Loadable from '@7rulnik/react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "list" */ './ListContainer'),
  loading: () => null,
})
