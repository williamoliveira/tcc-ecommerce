import { connect } from 'react-redux'
import { storeShape } from 'react-redux/lib/utils/PropTypes'
import { compose, getContext, withProps } from 'recompose'
import Login from './Login'
import {
  actions as authActions,
  selectors as authSelectors,
} from '../../../../../../modules/auth'
import registerModule, {
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

export default compose(
  getContext({ store: storeShape.isRequired }),
  withProps(({ store }) => {
    store.custom.injectModule('register', registerModule)
  }),
  connect(mapStateToProps, actionCreators),
)(Login)
