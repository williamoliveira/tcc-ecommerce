import { connect } from 'react-redux'
import { compose } from 'recompose'
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

export default compose(connect(mapStateToProps, actionCreators))(Cart)
