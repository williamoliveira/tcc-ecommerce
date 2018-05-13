import { connect } from 'react-redux'
import { storeShape } from 'react-redux/lib/utils/PropTypes'
import { compose, getContext, withProps } from 'recompose'
import productGroupsModule from '../../../../../../modules/productGroups'
import productsModule from '../../../../../../modules/products'
import List from './List'
import {
  selectors as appSelectors,
  actions as appActions,
} from '../../../../../../modules/app'
import {
  selectors as productSelectors,
  actions as productActions,
} from '../../../../../../modules/products/modules/list'
import {
  selectors as filterSelectors,
  actions as filterActions,
} from '../../../../../../modules/products/modules/list/modules/filters'
import {
  selectors as productGroupSelectors,
  actions as productGroupActions,
} from '../../../../../../modules/productGroups/modules/list'
import {
  selectors as cartSelectors,
  actions as cartActions,
} from '../../../../../../modules/cart'

const mapStateToProps = state => ({
  products: productSelectors.getCurrentPageProducts(state),
  productGroups: productGroupSelectors.getCurrentPageProductGroups(state),
  pagination: productSelectors.getPagination(state),
  cart: cartSelectors.getCart(state),
  filters: filterSelectors.getFilters(state),
  sliders: appSelectors.getSliders(state),
})

const actionCreators = {
  fetchManyProducts: productActions.fetchMany,
  fetchManyProductGroups: productGroupActions.fetchMany,
  addItemToCart: cartActions.addItem,
  changeFilters: filterActions.changeFilters,
}

export default compose(
  getContext({
    store: storeShape.isRequired,
  }),
  withProps(({ store }) => {
    if (store.custom.injectedModules.list) return
    store.custom.injectedModules.list = true

    store.custom.injectModule(productsModule)
    store.custom.injectModule(productGroupsModule)
  }),
  connect(mapStateToProps, actionCreators),
)(List)
