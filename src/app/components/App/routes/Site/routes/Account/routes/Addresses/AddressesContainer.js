import { connect } from 'react-redux'
import { storeShape } from 'react-redux/lib/utils/PropTypes'
import withRouter from 'react-router-dom/withRouter'
import { getContext, withProps } from 'recompose'
import compose from 'recompose/compose'
import addressesModule, {
  actions,
  selectors,
} from '../../../../../../../../modules/addresses/modules/list'
import Addresses from './Addresses'

const mapStateToProps = state => ({
  addresses: selectors.getCurrentPageAddresses(state),
  pagination: selectors.getPagination(state),
  isLoading: selectors.getIsLoading(state),
  apiError: selectors.getError(state),
})

const actionCreators = {
  fetchManyAddresses: actions.fetchMany,
}

export default compose(
  getContext({ store: storeShape.isRequired }),
  withProps(({ store }) => {
    store.custom.injectModule('addresses', addressesModule)
  }),
  withRouter,
  connect(mapStateToProps, actionCreators),
)(Addresses)
