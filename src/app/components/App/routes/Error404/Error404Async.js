import Loadable from '@7rulnik/react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "error404" */ './Error404'),
  loading: () => null,
})
