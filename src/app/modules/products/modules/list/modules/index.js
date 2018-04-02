import injectFilters, * as filters from './filters'

export { filters }

export default (store) => {
  injectFilters(store)
}
