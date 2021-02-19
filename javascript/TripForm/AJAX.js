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
  const id = tripObj.id > 0 ? tripObj.id : null
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

export {getTrip, postTrip}
