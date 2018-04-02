import { connect } from 'react-redux'
import PrivateRoute from './PrivateRoute'
import { getIsAuthenticated } from '../../modules/auth/selectors'

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
})

const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(PrivateRoute)
