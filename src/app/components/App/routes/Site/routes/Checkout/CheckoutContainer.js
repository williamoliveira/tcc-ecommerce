import { connect } from 'react-redux'
import { selectors, actions } from '../../../../../../modules/cart'
import Checkout from './Checkout'

const mapStateToProps = state => ({
  checkout: selectors.getCart(state),
  isLoading: selectors.getIsLoading(state),
  error: selectors.getError(state),
})

const actionCreators = {
  completeOrder: actions.completeOrder,
  setAddress: actions.setAddress,
}

export default connect(mapStateToProps, actionCreators)(Checkout)
