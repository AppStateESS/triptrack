'use strict'

import React, {useState, useEffect, useRef, Fragment} from 'react'
import PropTypes from 'prop-types'
import {tripSettings} from './TripDefaults'
import Host from './Host'
import Contact from './Contact'
import Schedule from './Schedule'
import Documents from './Documents'
import {deleteTrip} from '../api/TripAjax'

import {approvedIcon} from './Form/Node'
import {associateEvent, saveTrip, confirmTrip} from './Form/XHR'
import {getOrganizationEvents, getEvent} from '../api/Engage'
import Overlay from '@essappstate/canopy-react-overlay'
import Confirmation from './Confirmation'
import UpcomingEvents from './UpcomingEvents'
import CurrentAssociation from './CurrentAssociation'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Form = ({
  tripDocuments,
  organizations,
  defaultTrip,
  allowInternational,
  contactBannerRequired,
  role,
  allowApproval,
  hostLabel,
  organizationLabel,
  accommodationRequired,
  secondaryRequired,
  allowUpload,
  uploadRequired,
  uploadInstructions,
  confirmationRequired,
  confirmationInstructions,
}) => {
  const [associatedEvent, setAssociatedEvent] = useState()
  const [currentOrganization, setCurrentOrganization] = useState({})
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [confirmModal, setConfirmModal] = useState(false)
  const [documents, setDocuments] = useState(tripDocuments)
  const [errors, setErrors] = useState({...tripSettings.no})
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [trip, setTrip] = useState({...defaultTrip})
  const [changesMade, setChangesMade] = useState()

  /**
   * Tracks initial trip load
   */
  const top = useRef()
  const init = useRef(false)

  useEffect(() => {
    plugAssociatedEvent(trip.engageEventId)
  }, [])

  useEffect(() => {
    if (init.current) {
      setChangesMade(true)
    }
    init.current = true
  }, [trip])

  /**
   * Performs an error check on the host and visitPurpose
   * fields after an associated event is set. This clears
   * a no content error.
   */
  useEffect(() => {
    if (associatedEvent) {
      errorCheck('host', trip.host)
      errorCheck('visitPurpose', trip.visitPurpose)
    }
  }, [associatedEvent])

  /**
   * Makes sure depart, day of, and return dates are synced.
   */
  useEffect(() => {
    if (trip.timeDeparting > trip.timeEventStarts) {
      setFormElement('timeDeparting', trip.timeEventStarts)
    }
    if (trip.timeEventStarts > trip.timeReturn) {
      setFormElement('timeReturn', trip.timeEventStarts)
    }
  }, [trip.timeDeparting, trip.timeEventStarts, trip.timeReturn])

  /**
   * Loads list of events occurring for the currently selected organization.
   */
  useEffect(() => {
    if (trip.organizationId > 0) {
      setCurrentOrganization(
        organizations.find((element) => element.id == trip.organizationId)
      )
      loadEvents(trip.organizationId, role)
    }
  }, [trip.organizationId])

  useEffect(() => {
    if (!associatedEvent) {
      setLoadingEvent(false)
      return
    }
    if (
      associatedEvent.organizationIds.indexOf(currentOrganization.engageId) ==
      -1
    ) {
      setAssociatedEvent(null)
      trip.engageEventId = 0
      setTrip({...trip})
    }
  }, [currentOrganization])

  /**
   * Loads events associated to the organizationId
   * @param {number} organizationId
   */
  const loadEvents = (organizationId, role) => {
    setLoadingEvents(true)
    getOrganizationEvents(organizationId, role).then((response) => {
      if (response.data) {
        setEvents(response.data)
      } else {
        setEvents([])
      }
      setLoadingEvents(false)
    })
  }

  const onComplete = () => {
    if (confirmationRequired && trip.confirmedDate === 0) {
      setConfirmModal(true)
    } else {
      window.location.href = `./triptrack/${role}/Trip/`
    }
  }

  const eventAssociation = (eventId) => {
    associateEvent({
      eventId,
      events,
      role,
      trip,
      plugAssociatedEvent,
      setTrip,
    })
  }

  const scrollToError = () => {
    for (const property in errors) {
      if (errors[property]) {
        switch (property) {
          case 'submitName':
          case 'submitEmail':
            window.scrollTo(
              0,
              document.getElementById('submitter-info').offsetTop
            )
            return

          case 'host':
          case 'destinationCity':
            window.scrollTo(0, document.getElementById('host-info').offsetTop)
            return

          case 'contactName':
          case 'contactEmail':
          case 'contactPhone':
          case 'secContactName':
          case 'secContactEmail':
          case 'secContactPhone':
            window.scrollTo(
              0,
              document.getElementById('contact-info').offsetTop
            )
            return

          case 'timeDeparting':
          case 'timeEventStart':
          case 'timeReturn':
            window.scrollTo(
              0,
              document.getElementById('schedule-info').offsetTop
            )
            return
        }
      }
    }
  }

  const tripSave = () => {
    if (finalErrorCheck()) {
      saveTrip({
        trip,
        role,
        setErrors,
        onComplete,
      })
    } else {
      scrollToError()
    }
  }

  const setFormElement = (key, value) => {
    trip[key] = value
    setTrip({...trip})
    errorCheck(key, value)
  }

  const cancelTrip = () => {
    if (confirm('Are you sure you want to permanently delete this trip?')) {
      deleteTrip(trip.id, role).then(() => {
        location.href = `./triptrack/${role}/Trip`
      })
    }
  }

  /**
   * Receives an eventId and queries the server for the event
   * information. If found, it is copied to associatedEvent. If
   * not found, associatedEvent is cleared with name only stub object.
   * @param {number} eventId
   * @returns void
   */
  const plugAssociatedEvent = (eventId) => {
    if (eventId === 0) {
      return
    }
    setLoadingEvent(true)
    getEvent(eventId, role).then((response) => {
      const matchingEvent = response.data[0]
      if (matchingEvent !== undefined) {
        setAssociatedEvent(matchingEvent)
      } else {
        setAssociatedEvent({name: ''})
      }
      setLoadingEvent(false)
    })
  }

  const completeConfirmation = (confirmResult) => {
    if (confirmResult) {
      confirmTrip(trip.id, role).then(() => {
        window.location.href = `./triptrack/${role}/Trip/`
      })
    }
    setConfirmModal(false)
  }

  const errorCheck = (name, value) => {
    const emailMatch = (value) => {
      return value.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/) === null
    }

    const phoneMatch = (value) => {
      return value.replace(/\W/, '').length < 7
    }

    let errorFound = false
    switch (name) {
      case 'organizationId':
        errorFound = parseInt(trip.organizationId) === 0
        break

      case 'contactPhone':
        errorFound = phoneMatch(value)
        break

      case 'secContactPhone':
        if (secondaryRequired || value.length > 0) {
          errorFound = phoneMatch(value)
        }
        break

      case 'secContactEmail':
        if (secondaryRequired || value.length > 0) {
          errorFound = emailMatch(value)
        }
        break

      case 'contactEmail':
      case 'submitEmail':
        errorFound = emailMatch(value)
        break

      case 'secContactName':
        if (secondaryRequired) {
          errorFound = value.length === 0
        }
        break

      case 'housingAddress':
        if (accommodationRequired) {
          errorFound = value.length === 0
        }
        break

      default:
        errorFound = value.length === 0
        break
    }
    errors[name] = errorFound
    setErrors({...errors})
    return errorFound
  }

  const finalErrorCheck = () => {
    let foundError = false

    const checklist = [
      'contactName',
      'contactEmail',
      'contactPhone',
      'destinationCity',
      'host',
      'housingAddress',
      'secContactEmail',
      'secContactEmail',
      'secContactName',
      'secContactPhone',
    ]

    checklist.forEach((check) => {
      if (errorCheck(check, trip[check])) {
        foundError = true
      }
    })

    if (errorCheck('organizationId')) {
      foundError = true
    }
    return !foundError
  }

  const saveButton = (
    <div className="text-center mb-2">
      <button
        className="btn btn-success"
        onClick={tripSave}
        disabled={!changesMade}>
        Save travel plan
      </button>
    </div>
  )

  let confirmedLabel
  if (confirmationRequired) {
    if (trip.confirmedDate > 0) {
      confirmedLabel = (
        <div className="badge badge-success float-right">
          Confirmed on: {trip.formatted.confirmedDate.date}
        </div>
      )
    } else {
      confirmedLabel = (
        <div className="badge badge-danger float-right">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setConfirmModal(true)
            }}
            className="text-white">
            Not confirmed
          </a>
        </div>
      )
    }
  }

  let listLink
  if (role === 'Member') {
    listLink = (
      <div>
        <a href={`./triptrack/${role}/Trip`}>
          <FontAwesomeIcon icon="arrow-circle-left" />
          &nbsp;Back to trip list
        </a>
      </div>
    )
  }

  let event
  if (currentOrganization?.engageId === 0) {
    event = (
      <span className="text-secondary">
        <em>Not an Engage organization</em>
      </span>
    )
  } else if (loadingEvent) {
    event = (
      <Fragment>
        <FontAwesomeIcon icon="spinner" spin /> Loading event data...
      </Fragment>
    )
  } else if (trip.engageEventId === 0 && trip.organizationId > 0) {
    event = (
      <UpcomingEvents
        {...{events, loadingEvents, eventAssociation}}
        engageEventId={trip.engageEventId}
      />
    )
  } else if (trip.organizationId > 0 && associatedEvent) {
    event = (
      <CurrentAssociation
        associatedEvent={associatedEvent}
        clear={() => {
          changesMade.current = true
          trip.engageEventId = 0
          setTrip({...trip})
        }}
      />
    )
  } else {
    event = (
      <div>
        {trip.organizationId === 0 ? (
          <span className="text-secondary">
            Choose an attending organization
          </span>
        ) : (
          <em>No association</em>
        )}
      </div>
    )
  }

  return (
    <div ref={top}>
      {confirmedLabel}
      <h3>Enter trip information</h3>
      {listLink}
      <p>Please enter all requested, required information below:</p>
      {approvedIcon({trip, allowApproval, setFormElement})}

      <a id="submitter-info"></a>
      <div className="row">
        <div className="col-sm-6">
          <fieldset className="mb-4">
            <legend className="border-bottom mb-3">Submitter</legend>
            {trip.submitName}
            <br />
            <a href={`mailto:${trip.submitEmail}`}>{trip.submitEmail}</a>
          </fieldset>
        </div>
        <div className="col-sm-6">
          <fieldset>
            <legend className="border-bottom mb-3">Associated Event</legend>
            {event}
          </fieldset>
        </div>
      </div>

      <a id="host-info"></a>
      <Host
        trip={trip}
        setFormElement={setFormElement}
        allowInternational={allowInternational}
        accommodationRequired={accommodationRequired}
        hostLabel={hostLabel}
        setErrors={setErrors}
        organizationLabel={organizationLabel}
        organizationList={organizations}
        role={role}
        errors={errors}
      />
      {saveButton}
      <a id="contact-info"></a>
      <Contact
        trip={trip}
        setFormElement={setFormElement}
        contactBannerRequired={contactBannerRequired}
        secondaryRequired={secondaryRequired}
        errors={errors}
        setErrors={setErrors}
      />
      <a id="schedule-info"></a>
      <Schedule trip={trip} setFormElement={setFormElement} />
      {allowUpload && (
        <div className="row mb-5">
          <div className="col-sm-7">
            <Documents
              {...{
                completed: trip.completed,
                setDocuments,
                documents,
                allowUpload,
                tripId: trip.id,
                role,
                uploadRequired,
                uploadInstructions,
              }}
            />
          </div>
        </div>
      )}
      <div className="text-center">
        {saveButton}
        <div>
          {!trip.completed ? (
            <button className="btn btn-danger" onClick={cancelTrip}>
              Cancel trip
            </button>
          ) : (
            <a href={`./triptrack/${role}/Trip`} className="btn btn-danger">
              Cancel changes
            </a>
          )}
        </div>
      </div>

      <Overlay
        show={confirmModal}
        close={() => setConfirmModal(false)}
        title="Confirmation of travel requirements">
        <Confirmation
          {...{confirmationInstructions, completeConfirmation}}
          cancel={() => setConfirmModal(false)}
        />
      </Overlay>
    </div>
  )
}

Form.propTypes = {
  role: PropTypes.string,
  tripId: PropTypes.number,
  defaultState: PropTypes.string,
  defaultCountry: PropTypes.string,
  allowInternational: PropTypes.bool,
  contactBannerRequired: PropTypes.bool,
  allowApproval: PropTypes.bool,
  hostLabel: PropTypes.string,
  organizationLabel: PropTypes.string,
  accommodationRequired: PropTypes.bool,
  secondaryRequired: PropTypes.bool,
  organizations: PropTypes.array,
  defaultTrip: PropTypes.object,
  allowUpload: PropTypes.bool,
  uploadRequired: PropTypes.bool,
  uploadInstructions: PropTypes.string,
  tripDocuments: PropTypes.array,
  confirmationInstructions: PropTypes.string,
  confirmationRequired: PropTypes.bool,
}

export default Form
