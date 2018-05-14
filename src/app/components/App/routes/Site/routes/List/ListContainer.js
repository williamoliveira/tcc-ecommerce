import { connect } from 'react-redux'
import { storeShape } from 'react-redux/lib/utils/PropTypes'
import { compose, getContext, withProps } from 'recompose'
import { selectors as appSelectors } from '../../../../../../modules/app'
import {
  actions as cartActions,
  selectors as cartSelectors,
} from '../../../../../../modules/cart'
import productGroupsModule from '../../../../../../modules/productGroups'
import {
  actions as productGroupActions,
  selectors as productGroupSelectors,
} from '../../../../../../modules/productGroups/modules/list'
import productsModule from '../../../../../../modules/products'
import {
  actions as productActions,
  selectors as productSelectors,
} from '../../../../../../modules/products/modules/list'
import {
  actions as filterActions,
  selectors as filterSelectors,
} from '../../../../../../modules/products/modules/list/modules/filters'
import List from './List'

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
  getContext({ store: storeShape.isRequired }),
  withProps(({ store }) => {
    store.custom.injectModule('products', productsModule)
    store.custom.injectModule('productGroups', productGroupsModule)
  }),
  connect(mapStateToProps, actionCreators),
)(List)
