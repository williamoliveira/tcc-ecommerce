import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Menu from './Menu'
import {
  selectors as appSelectors,
  actions as appActions,
} from '../../../../../../modules/app'
import {
  selectors as authSelectors,
  actions as authActions,
} from '../../../../../../modules/auth'
import {
  selectors as cartSelectors,
  actions as cartActions,
} from '../../../../../../modules/cart'

const mapStateToProps = state => ({
  user: authSelectors.getUser(state),
  cart: cartSelectors.getCart(state),
  company: appSelectors.getCompany(state),
})

const actionCreators = {
  logout: authActions.logout,
  removeItemByProductId: cartActions.removeItemByProductId,
}

export default withRouter(connect(mapStateToProps, actionCreators)(Menu))
