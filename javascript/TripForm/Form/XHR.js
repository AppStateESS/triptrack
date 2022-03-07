'use strict'
import {postTrip, patchApproval} from '../../api/TripAjax'
import {getList} from '../../api/Fetch'
import {getAttendedBannerIds} from '../../api/Engage'

const associateEvent = ({
  eventId,
  events,
  role,
  setAttendedLoading,
  members,
  selectedMembers,
  setAttendedModal,
  setNewMembers,
  setSelectedMembers,
  trip,
  plugAssociatedEvent,
  setTrip,
}) => {
  const event = findAssociatedEvent(events, eventId)

  getAttendedBannerIds(eventId, role).then((response) => {
    setAttendedLoading(true)
    const attended = response.data
    const nonOrgMembers = []
    selectedMembers = []
    attended.forEach((attend) => {
      const {bannerId} = attend
      const result = members.find((element) => element.bannerId == bannerId)
      if (result) {
        if (selectedMembers.indexOf(result.id > -1)) {
          selectedMembers.push(result.id)
        }
      } else {
        nonOrgMembers.push(attend)
      }
    })
    if (nonOrgMembers.length > 0) {
      setAttendedModal(true)
    }
    setAttendedLoading(false)
    setNewMembers(nonOrgMembers)
    setSelectedMembers([...selectedMembers])
  })

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

const getOrganizationMembers = (organizationId, role) => {
  return getList(`./triptrack/${role}/Member`, {
    orgId: organizationId,
  })
}

const getSelectedMembers = (tripId, role) => {
  return getList(`./triptrack/${role}/Trip/${tripId}/memberList`)
}

/**
 * Loads the members of an organization
 */
const loadMembers = (organizationId, role, setMembers) => {
  return getOrganizationMembers(organizationId, role).then((response) => {
    setMembers(response.data)
  })
}

const loadSelectedMembers = (tripId, role, setSelectedMembers) => {
  return getSelectedMembers(tripId, role).then((response) => {
    setSelectedMembers(response.data)
  })
}

const parseDescription = (desc) => {
  const removeTag = desc.replace(/<[^>]+>|\r\n/gi, '')
  const noNbsp = removeTag.replace(/&nbsp;/gi, ' ')
  const firstSentence = noNbsp.split(/[!?.]/)[0]
  return firstSentence.replace(/^\W+/, '')
}

const saveTrip = ({
  confirmed,
  finalErrorCheck,
  confirmationRequired,
  trip,
  setConfirmModal,
  selectedMembers,
  defaultTrip,
  role,
  setErrors,
  addMembersToTrip,
  onComplete,
}) => {
  if (finalErrorCheck()) {
    if (
      confirmationRequired &&
      trip.confirmedDate === 0 &&
      confirmed === false
    ) {
      setConfirmModal(true)
      return
    }
    Promise.all([
      postTrip(trip, role),
      addMembersToTrip(selectedMembers, defaultTrip.id, role),
    ]).then((response) => {
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
  } else {
    console.log('fail error')
  }
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
  loadMembers,
  loadSelectedMembers,
  saveTrip,
  toggleApproval,
  associateEvent,
  findAssociatedEvent,
}
