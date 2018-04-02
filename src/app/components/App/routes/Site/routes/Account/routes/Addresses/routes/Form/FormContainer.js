import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectors } from '../../../../../../../../../../modules/addresses'
import {
  actions as formActions,
  selectors as formSelectors,
} from '../../../../../../../../../../modules/addresses/modules/form'
import { actions as showActions } from '../../../../../../../../../../modules/addresses/modules/show'
import Form from './Form'

const mapStateToProps = (state, { match: { params: { id } } }) => ({
  address: selectors.getById(state, id),
  isLoading: formSelectors.getIsLoading(state),
  apiError: formSelectors.getError(state),
})

const actionCreators = {
  fetchOneAddress: showActions.fetchOne,
  saveForm: formActions.saveOne,
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form))
