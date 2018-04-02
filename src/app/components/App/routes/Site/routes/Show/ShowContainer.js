import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectors } from '../../../../../../modules/products'
import {
  actions as cartActions,
  selectors as cartSelectors,
} from '../../../../../../modules/cart'
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

export default withRouter(connect(mapStateToProps, actionCreators)(Show))
