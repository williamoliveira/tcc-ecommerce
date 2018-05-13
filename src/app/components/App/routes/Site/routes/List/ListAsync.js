import universal from 'react-universal-component'

export default universal(() => import('./ListContainer'), {
  loading: () => {
    console.log('Loading')
    return 'Carregando...'
  },
  onLoad(module, options) {
    console.log('onLoad', options)
  },
})
