import { connect } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import compose from 'recompose/compose'
import { selectors } from '../../../../../../../../../../modules/addresses'
import {
  actions,
  selectors as deleteUiSelectors,
} from '../../../../../../../../../../modules/addresses/modules/delete'
import { actions as showActions } from '../../../../../../../../../../modules/addresses/modules/show'
import Delete from './Delete'

const mapStateToProps = (state, { match: { params: { id } } }) => ({
  address: selectors.getById(state, id),
  isLoading: deleteUiSelectors.getIsLoading(state),
  apiError: deleteUiSelectors.getError(state),
})

const actionCreators = {
  fetchOneAddress: showActions.fetchOne,
  deleteOneAddress: actions.deleteOne,
}

export default compose(withRouter, connect(mapStateToProps, actionCreators))(Delete)
