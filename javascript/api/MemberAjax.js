import axios from 'axios'
import 'regenerator-runtime'

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
    const response = await axios.patch(
      url,
      {tripId},
      {
        headers,
      }
    )
    return response
  } catch (error) {
    return false
  }
}
const dropFromOrg = async (memberId, orgId) => {
  const url = `triptrack/Admin/Member/${memberId}/dropFromOrganization`
  try {
    const response = await axios.patch(
      url,
      {orgId},
      {
        headers,
      }
    )
    return response
  } catch (error) {
    return false
  }
}

const save = async (memberId = 0) => {
  let method
  let url = 'triptrack/Admin/Member'
  if (memberId > 0) {
    method = 'put'
    url += '/' + memberId
  } else {
    method = 'post'
  }

  return await axios({
    method,
    url,
    data: memberId,
    timeout: 3000,
    headers,
  })
}

const loadByBannerId = async (bannerId) => {
  return await axios.get(
    `./triptrack/Admin/Member/getByBannerId/?studentBannerId=${bannerId}`,
    {
      headers,
    }
  )
}

const loadByUsername = async (username) => {
  return await axios.get(
    `./triptrack/Admin/Member/getByUsername/?username=${username}`,
    {
      headers,
    }
  )
}

const deleteMember = async (id) => {
  return await axios({
    method: 'delete',
    url: './triptrack/Admin/Member/' + id,
    timeout: 3000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
}

export {
  addMember,
  dropFromTrip,
  dropFromOrg,
  save,
  loadByBannerId,
  loadByUsername,
  deleteMember,
}
