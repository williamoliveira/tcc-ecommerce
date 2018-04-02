import { connect } from 'react-redux'
import { actions, selectors } from '../../../../../../modules/auth'
import Profile from './Account'

const mapStateToProps = state => ({
  user: selectors.getUser(state),
  isLoading: selectors.getIsLoading(state),
})

const actionCreators = {
  save: actions.updateUser,
}

export default connect(mapStateToProps, actionCreators)(Profile)
