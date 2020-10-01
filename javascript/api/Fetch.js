import 'regenerator-runtime'

const getList = async (url) => {
  try {
    let response = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    if (response.ok) {
      const json = await response.json()
      return json
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export default getList
