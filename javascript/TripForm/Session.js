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
    //console.log('combining', tripSession)
    return {...trip, ...tripSession}
  }
}

const setTripSession = (trip) => {
  console.log('setting', trip)
  const cloneTrip = Object.assign({}, trip)
  delete cloneTrip.organizationId
  delete cloneTrip.id
  delete cloneTrip.submitEmail
  delete cloneTrip.submitName
  delete cloneTrip.submitUsername
  delete cloneTrip.memberCount
  delete cloneTrip.engageEventId

  sessionStorage.setItem('trip', JSON.stringify(cloneTrip))
}

export {clearTripSession, plugTripSession, setTripSession}
