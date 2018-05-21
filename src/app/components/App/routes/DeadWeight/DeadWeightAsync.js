import Loadable from '@7rulnik/react-loadable'

export default Loadable({
  loader: () => import(/* webpackChunkName: "dead-weight" */ './DeadWeight'),
  loading: () => null,
})
