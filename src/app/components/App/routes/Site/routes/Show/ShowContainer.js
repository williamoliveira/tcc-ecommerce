import { connect } from 'react-redux'
import { storeShape } from 'react-redux/lib/utils/PropTypes'
import { withRouter } from 'react-router-dom'
import { compose, getContext, withProps } from 'recompose'
import {
  actions as cartActions,
  selectors as cartSelectors,
} from '../../../../../../modules/cart'
import productsModule, { selectors } from '../../../../../../modules/products'
import { actions } from '../../../../../../modules/products/modules/show'
import Show from './Show'

const mapStateToProps = (state, { match: { params: { id } } }) => ({
  product: selectors.getById(state, id),
  cart: cartSelectors.getCart(state),
})

const actionCreators = {
  fetchOneProduct: actions.fetchOne,
  addItemToCart: cartActions.addItem,
}

export default compose(
  getContext({ store: storeShape.isRequired }),
  withProps(({ store }) => {
    store.custom.injectModule('products', productsModule)
  }),
  withRouter,
  connect(mapStateToProps, actionCreators),
)(Show)
