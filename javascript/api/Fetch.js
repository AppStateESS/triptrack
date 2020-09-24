import 'regenerator-runtime'

const getList = async (url) => {
  try {
    let response = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    if (response.ok) {
      return response.json()
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export default getList
