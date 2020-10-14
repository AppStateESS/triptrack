import axios from 'axios'
import 'regenerator-runtime'

const getList = async (url, options) => {
  try {
    const response = await axios.get(url, {
      data: options,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    return response.data
  } catch (error) {
    return false
  }
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

export {getList, sendDelete}
