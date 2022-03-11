'use strict'
import {postTrip, patchApproval} from '../../api/TripAjax'
import {patchItem} from '../../api/Fetch'

const associateEvent = ({
  eventId,
  events,
  trip,
  plugAssociatedEvent,
  setTrip,
}) => {
  const event = findAssociatedEvent(events, eventId)
  const tripCopy = {...trip}

  tripCopy.timeDeparting = unixTime(event.startsOn)
  tripCopy.timeEventStarts = unixTime(event.startsOn)
  tripCopy.timeReturn = unixTime(event.endsOn)
  tripCopy.host = event.name
  tripCopy.visitPurpose = parseDescription(event.description)
  if (event.address.city !== null) {
    tripCopy.destinationCity = event.address.city
  }
  if (event.address.state !== null) {
    tripCopy.destinationState = event.address.state
  }
  if (tripCopy.housingAddress.length === 0) {
    tripCopy.housingAddress += event.address.line1 ?? ''
    tripCopy.housingAddress +=
      event.address.line1 && event.address.line2 ? ' ' : ''
    tripCopy.housingAddress += event.address.line2 ?? ''
  }
  tripCopy.engageEventId = event.id
  plugAssociatedEvent(event.id)

  setTrip(tripCopy)
}

const findAssociatedEvent = (eventList, engageEventId) => {
  const found = eventList.find((value) => {
    return value.id === parseInt(engageEventId)
  })

  return found
}

const parseDescription = (desc) => {
  const removeTag = desc.replace(/<[^>]+>|\r\n/gi, '')
  const noNbsp = removeTag.replace(/&nbsp;/gi, ' ')
  const firstSentence = noNbsp.split(/[!?.]/)[0]
  return firstSentence.replace(/^\W+/, '')
}

const saveTrip = ({trip, role, setErrors, onComplete}) => {
  return Promise.all([postTrip(trip, role)]).then((response) => {
    if (response[0].data.success) {
      onComplete()
    } else {
      const errClone = response[0].data.errors
      const errorResult = Object.keys(errClone)
      errorResult.forEach((element) => {
        errClone[element] = true
      })
      setErrors(errClone)
    }
  })
}

const confirmTrip = (tripId, role) => {
  return patchItem('Trip', tripId, {}, 'confirm', role)
}

const toggleApproval = ({toggle, setFormElement, tripId}) => {
  setFormElement('approved', toggle)
  if (tripId > 0) {
    patchApproval(toggle, tripId)
  }
}

const unixTime = (stamp) => {
  return parseInt((new Date(stamp).getTime() / 1000).toFixed(0))
}

export {
  saveTrip,
  toggleApproval,
  associateEvent,
  findAssociatedEvent,
  confirmTrip,
}
