import axios from 'axios'
import {getItem, postItem, sendDelete} from './Fetch'
import 'regenerator-runtime'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

const getTrip = async (tripId, role) => {
  return getItem('Trip', tripId, role)
}

const postTrip = async (tripObj, role) => {
  return postItem(tripObj, 'Trip', role)
}

const patchApproval = async (tripId) => {
  return await axios({
    method: 'patch',
    url: `triptrack/Admin/Trip/${tripId}/approval`,
    timeout: 3000,
    headers,
  })
}

const deleteTrip = async (tripId) => {
  const url = 'triptrack/Admin/Trip/' + tripId
  return sendDelete(url)
}

export {getTrip, postTrip, patchApproval, deleteTrip}
