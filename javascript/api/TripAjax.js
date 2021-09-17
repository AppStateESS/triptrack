import axios from 'axios'
import {getItem, postItem, sendDelete, getList} from './Fetch'
import 'regenerator-runtime'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

const getTrip = async (tripId, role) => {
  return getItem('Trip', tripId, role)
}

const getTripDocuments = async (tripId, role) => {
  const url = `triptrack/${role}/Document/`
  const options = {tripId}
  return getList(url, options)
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

const addMembersToTrip = async (memberArray, tripId, role) => {
  const url = `triptrack/${role}/Trip/addMembers`
  try {
    const response = await axios.post(
      url,
      {tripId, members: memberArray},
      {headers}
    )
    return response
  } catch (error) {
    return false
  }
}

const deleteTrip = async (tripId, role = 'Admin') => {
  const url = `triptrack/${role}/Trip/${tripId}`
  return sendDelete(url)
}

const removeDocument = async (documentId, role) => {
  const url = `triptrack/${role}/Document/${documentId}`
  return sendDelete(url)
}

const getIncomplete = async () => {
  const url = `triptrack/Admin/Trip/incomplete`
  return await axios.get(url, {headers})
}

export {
  getTrip,
  postTrip,
  patchApproval,
  deleteTrip,
  addMembersToTrip,
  getTripDocuments,
  removeDocument,
  getIncomplete,
}
