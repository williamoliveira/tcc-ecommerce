import { axios, extractData } from '../../../utils/apiResource'
import config from '../../../../../config'

export default {
  register: data =>
    axios
      .post(`/api/v1/companies/${config('companyId')}/register`, data)
      .then(extractData),
}
