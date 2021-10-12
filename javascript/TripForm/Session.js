const clearTripSession = (callback) => {
  const waitHere = new Promise((resolve) => {
    sessionStorage.removeItem('trip')
    resolve()
  })
  waitHere.then(callback)
}

const plugTripSession = (trip) => {
  const tripSession = JSON.parse(sessionStorage.getItem('trip'))
  if (!tripSession) {
    return false
  } else {
    return {...trip, ...tripSession}
  }
}

const setTripSession = (trip) => {
  if (trip) {
    const cloneTrip = {...trip}
    delete cloneTrip.id
    delete cloneTrip.submitEmail
    delete cloneTrip.submitName
    delete cloneTrip.submitUsername
    delete cloneTrip.memberCount
    delete cloneTrip.engageEventId

    sessionStorage.setItem('trip', JSON.stringify(cloneTrip))
  }
}

export {clearTripSession, plugTripSession, setTripSession}
