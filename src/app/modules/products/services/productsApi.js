import createApi from '../../../utils/apiResource'
import config from '../../../../config'

export default createApi(`/api/v1/companies/${config('companyId')}/products`)
