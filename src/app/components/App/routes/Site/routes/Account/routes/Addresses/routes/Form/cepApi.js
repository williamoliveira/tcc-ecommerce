import { axios, extractData } from '../../../../../../../../../../utils/apiResource'

export default {
  fetch: cep => axios.get(`/api/v1/cep/${cep}`).then(extractData),
}
