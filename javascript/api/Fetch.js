import axios from 'axios'
import 'regenerator-runtime'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

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

export {getList, sendDelete, getItem, postItem}
