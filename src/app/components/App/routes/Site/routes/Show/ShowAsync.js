import Loadable from '@7rulnik/react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "show" */ './ShowContainer'),
  loading: () => null,
})
