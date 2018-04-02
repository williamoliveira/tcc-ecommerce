import { connect } from 'react-redux'
import { selectors, actions } from '../../../../../../modules/cart'
import Cart from './Cart'

const mapStateToProps = state => ({
  cart: selectors.getCart(state),
})

const actionCreators = {
  removeItemByProductId: actions.removeItemByProductId,
  setItemQuantityByProductId: actions.setItemQuantityByProductId,
  completeOrder: actions.completeOrder,
}

export default connect(mapStateToProps, actionCreators)(Cart)
