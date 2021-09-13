import axios from 'axios'
import 'regenerator-runtime'
import {patchItem, postItem, sendDelete} from './Fetch'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

const addMember = async (memberId, orgId, tripId) => {
  const url = `triptrack/Admin/Member/${memberId}/add`
  try {
    const response = await axios.patch(url, {orgId, tripId}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const dropFromTrip = async (memberId, tripId) => {
  const url = `triptrack/Admin/Member/${memberId}/dropFromTrip`
  try {
    const response = await axios.patch(url, {tripId}, {headers})
    return response
  } catch (error) {
    return false
  }
}
const dropFromOrg = async (memberId, orgId) => {
  const url = `triptrack/Admin/Member/${memberId}/dropFromOrganization`
  try {
    const response = await axios.patch(url, {orgId}, {headers})
    return response
  } catch (error) {
    return false
  }
}

const save = async (member) => {
  return postItem(member, 'Member', 'Admin')
}

const loadByBannerId = async (bannerId) => {
  return await axios.get(
    `./triptrack/Admin/Member/getByBannerId/?studentBannerId=${bannerId}`,
    {headers}
  )
}

const loadByUsername = async (username) => {
  return await axios.get(
    `./triptrack/Admin/Member/getByUsername/?username=${username}`,
    {headers}
  )
}

const deleteMember = async (id) => {
  return await sendDelete('./triptrack/Admin/Member/' + id)
}

const restrictMember = async (id) => {
  return await patchItem(
    'Member',
    id,
    {varName: 'restricted', value: true},
    'restrict'
  )
}
const unrestrictMember = async (id) => {
  return await patchItem(
    'Member',
    id,
    {varName: 'restricted', value: false},
    'unrestrict'
  )
}

export {
  addMember,
  dropFromTrip,
  dropFromOrg,
  save,
  loadByBannerId,
  loadByUsername,
  deleteMember,
  restrictMember,
  unrestrictMember,
}
