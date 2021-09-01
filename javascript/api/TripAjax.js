import axios from 'axios'
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

const getTrip = (tripId, role) => {
  const url = `triptrack/${role}/Trip/${tripId}`
  return axios({
    url,
    method: 'get',
    headers,
  })
}

const postTrip = (tripObj, role) => {
  const id = tripObj.id > 0 ? tripObj.id : ''
  const url = `triptrack/${role}/Trip/${id}`
  return axios({
    method: tripObj.id > 0 ? 'put' : 'post',
    url,
    data: tripObj,
    timeout: 3000,
    headers,
  })
}

const patchApproval = (tripId) => {
  return axios({
    method: 'patch',
    url: `triptrack/Admin/Trip/${tripId}/approval`,
    timeout: 3000,
    headers,
  })
}

export {getTrip, postTrip, patchApproval}
