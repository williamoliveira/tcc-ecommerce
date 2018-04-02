import { connect } from 'react-redux'
import { selectors as authSelectors } from '../../modules/auth'
import IfUserCan from './IfUserCan'

const mapStateToProps = state => ({
  existingPermissions: authSelectors.getUserPermissionsNames(state),
  isPermissionsLoading: authSelectors.getIsLoading(state),
})

const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(IfUserCan)
