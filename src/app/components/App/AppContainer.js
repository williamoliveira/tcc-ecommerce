import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import App from './App'
import { selectors } from '../../modules/app'

const mapStateToProps = state => ({
  company: selectors.getCompany(state),
})

const actionCreators = {}

export default withRouter(connect(mapStateToProps, actionCreators)(App))
