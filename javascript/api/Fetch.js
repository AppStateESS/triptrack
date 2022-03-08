import axios from 'axios'
import 'regenerator-runtime'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

/**
 *
 * @param {string} url
 * @param {object} options
 * @returns Promise
 */
const getList = async (url, options) => {
  const response = await axios.get(url, {
    params: options,
    headers,
  })
  return response
}

const sendDelete = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const getItem = async (itemName, id, role = 'Admin') => {
  const url = `triptrack/${role}/${itemName}/${id}`
  return await axios.get(url, {
    headers,
  })
}

const patchItem = async (
  itemName,
  id,
  data,
  control = null,
  role = 'Admin'
) => {
  let url = `triptrack/${role}/${itemName}/${id}`
  if (control !== null) {
    url = url + '/' + control
  }

  return await axios({
    method: 'patch',
    url,
    data,
    timeout: 3000,
    headers,
  })
}

const postItem = async (item, itemName, role = 'Admin') => {
  const url = `triptrack/${role}/${itemName}/${item.id > 0 ? item.id : ''}`

  return await axios({
    method: item.id > 0 ? 'put' : 'post',
    url,
    data: item,
    timeout: 3000,
    headers,
  })
}

export {getList, sendDelete, getItem, postItem, patchItem}
