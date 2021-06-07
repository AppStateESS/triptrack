import axios from 'axios'
import 'regenerator-runtime'

const getList = async (url, options) => {
  const response = await axios.get(url, {
    params: options,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
  return response
}

const sendDelete = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    return response
  } catch (error) {
    return false
  }
}

const getItem = async (itemName, id) => {
  const url = `triptrack/Admin/${itemName}/${id}`
  return await axios.get(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
}

// Move this out
const addMember = async (memberId, orgId, tripId) => {
  const url = `triptrack/Admin/Member/${memberId}/add`
  try {
    const response = await axios.patch(
      url,
      {orgId, tripId},
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    )
    return response
  } catch (error) {
    return false
  }
}

export {getList, sendDelete, getItem, addMember}
