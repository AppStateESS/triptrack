import axios from 'axios'

const getTrip = (tripId, role) => {
  const url = `triptrack/${role}/Trip/${tripId}`
  return axios({
    url,
    method: 'get',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
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
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
}

const patchApproval = (approved, tripId) => {
  axios({
    method: 'patch',
    url: `triptrack/Admin/Trip/${tripId}/approval`,
    data: {approved},
    timeout: 3000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
    .then((response) => {})
    .catch((error) => {
      console.log('Error:', error)
    })
}

export {getTrip, postTrip, patchApproval}
