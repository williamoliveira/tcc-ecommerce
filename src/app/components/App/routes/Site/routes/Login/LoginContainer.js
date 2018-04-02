import { connect } from 'react-redux'
import Login from './Login'
import {
  actions as authActions,
  selectors as authSelectors,
} from '../../../../../../modules/auth'
import {
  actions as registerActions,
  selectors as registerSelectors,
} from '../../../../../../modules/register'

const mapStateToProps = state => ({
  isLoginLoading: authSelectors.getIsLoading(state),
  isRegisterLoading: registerSelectors.getIsLoading(state),
  isAuthenticated: authSelectors.getIsAuthenticated(state),
})

const actionCreators = {
  attemptLogin: authActions.attemptLogin,
  register: registerActions.register,
}

export default connect(mapStateToProps, actionCreators)(Login)
