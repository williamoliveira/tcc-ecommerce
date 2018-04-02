import { connect } from 'react-redux'
import Home from './List'
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

export default connect(mapStateToProps, actionCreators)(Home)
