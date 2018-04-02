import { connect } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import compose from 'recompose/compose'
import {
  actions,
  selectors,
} from '../../../../../../../../modules/addresses/modules/list'
import List from './List'

const mapStateToProps = state => ({
  addresses: selectors.getCurrentPageAddresses(state),
  pagination: selectors.getPagination(state),
  isLoading: selectors.getIsLoading(state),
  apiError: selectors.getError(state),
})

const actionCreators = {
  fetchManyAddresses: actions.fetchMany,
}

export default compose(withRouter, connect(mapStateToProps, actionCreators))(List)
