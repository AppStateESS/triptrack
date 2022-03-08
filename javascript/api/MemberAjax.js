import axios from 'axios'
import 'regenerator-runtime'
import {patchItem, postItem, sendDelete, getList} from './Fetch'

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

const getMemberListByOrganization = (organizationId, role = 'Admin') => {
  return getList(`./triptrack/${role}/Member/`, {organizationId})
}

const getEventAttending = (eventId, role = 'Admin') => {
  return getList(`./triptrack/${role}/Member/eventAttending`, {eventId})
}

const addAttendeeList = async (members, organizationId) => {
  const url = `/triptrack/Admin/Member/addAttendeeList`
  try {
    const response = await axios.post(url, {members, organizationId}, {headers})
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

const getParticipants = async (tripId, role = 'Admin') => {
  return await getList(`./triptrack/${role}/Member/`, {tripId})
}

const sendMembersAttending = async (tripId, members, role = 'Admin') => {
  const url = `./triptrack/${role}/Trip/addMembers`
  return await axios.post(url, {tripId, members}, {headers})
}

export {
  addMember,
  addAttendeeList,
  dropFromTrip,
  dropFromOrg,
  save,
  loadByBannerId,
  loadByUsername,
  deleteMember,
  restrictMember,
  unrestrictMember,
  getMemberListByOrganization,
  getEventAttending,
  getParticipants,
  sendMembersAttending,
}
