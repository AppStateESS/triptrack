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
  return axios.get(url, {
    params: options,
    headers,
  })
}

const sendDelete = async (url) => {
  try {
    const response = axios.delete(url, {
      headers,
    })
    return response
  } catch (error) {
    return false
  }
}

const getItem = async (itemName, id, role = 'Admin') => {
  const url = `triptrack/${role}/${itemName}/${id}`
  return axios.get(url, {
    headers,
  })
}

/**
 *
 * @param {string} itemName
 * @param {number} id
 * @param {object} data
 * @param {string} control
 * @param {string} role
 * @returns
 */
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

  return axios({
    method: 'patch',
    url,
    data,
    timeout: 3000,
    headers,
  })
}

const postItem = async (item, itemName, role = 'Admin') => {
  const url = `triptrack/${role}/${itemName}/${item.id > 0 ? item.id : ''}`

  return axios({
    method: item.id > 0 ? 'put' : 'post',
    url,
    data: item,
    timeout: 3000,
    headers,
  })
}

export {getList, sendDelete, getItem, postItem, patchItem}
