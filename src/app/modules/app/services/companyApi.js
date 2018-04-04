import { axios, extractData } from '../../../utils/apiResource'
import config from '../../../../../config'

export default {
  fetch: (query, axiosConfig) =>
    axios
      .get(`/api/v1/companies/${config('companyId')}`, { ...axiosConfig, params: query })
      .then(extractData),
}
