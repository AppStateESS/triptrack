'use strict'

import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {tripSettings} from './TripDefaults'
import Host from './Host'
import Contact from './Contact'
import Schedule from './Schedule'
import Documents from './Documents'
import {deleteTrip} from '../api/TripAjax'
import {approvedIcon} from './Form/Node'
import {associateEvent, saveTrip} from './Form/XHR'
import {getOrganizationEvents, getEvent} from '../api/Engage'
import {addMembersToTrip} from '../api/TripAjax'
import Overlay from '@essappstate/canopy-react-overlay'
import Confirmation from './Confirmation'
import UpcomingEvents from './UpcomingEvents'
import CurrentAssociation from './CurrentAssociation'

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
  const [associatedEvent, setAssociatedEvent] = useState({name: ''})
  const [confirmModal, setConfirmModal] = useState(false)
  const [documents, setDocuments] = useState(tripDocuments)
  const [errors, setErrors] = useState({...tripSettings.no})
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [trip, setTrip] = useState({...defaultTrip})

  /**
   * Tracks initial trip load
   */
  const tripComplete = useRef(false)

  const changesMade = useRef(false)

  /**
   * Performs an error check on the host and visitPurpose
   * fields after an associated event is set. This clears
   * a no content error.
   */
  useEffect(() => {
    if (associatedEvent.id) {
      errorCheck('host', trip.host)
      errorCheck('visitPurpose', trip.visitPurpose)
    }
  }, [associatedEvent])

  useEffect(() => {
    if (tripComplete.current) {
      loadEvents(trip.organizationId, role)
    }
  }, [trip.organizationId])

  useEffect(() => {
    if (tripComplete.current) {
      plugAssociatedEvent(trip.engageEventId)
    }
  }, [events])

  /**
   * Loads events associated to the organizationId
   * @param {number} organizationId
   */
  const loadEvents = (organizationId, role) => {
    setLoadingEvents(true)
    getOrganizationEvents(organizationId, role).then((response) => {
      setEvents(response.data)
      setLoadingEvents(false)
    })
  }

  const onComplete = () => {
    window.location.href = `./triptrack/${role}/Trip/`
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

  const tripSave = (confirmed = false) => {
    saveTrip({
      confirmed,
      finalErrorCheck,
      confirmationRequired,
      trip,
      setConfirmModal,
      defaultTrip,
      role,
      setErrors,
      addMembersToTrip,
      onComplete,
    })
  }

  const setFormElement = (key, value) => {
    changesMade.current = true
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

    getEvent(eventId).then((response) => {
      const matchingEvent = response.data[0]
      if (matchingEvent !== undefined) {
        setAssociatedEvent(matchingEvent)
      } else {
        setAssociatedEvent({name: ''})
      }
    })
  }

  const completeConfirmation = (confirmResult) => {
    if (confirmResult) {
      tripSave(true)
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

  const saveButton = changesMade.current ? (
    <div className="text-center">
      <button className="btn btn-sm btn-success" onClick={tripSave}>
        Save travel plan
      </button>
    </div>
  ) : null
  return (
    <div>
      <h3>Enter trip information</h3>
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
            {trip.engageEventId === 0 && trip.organizationId > 0 ? (
              <UpcomingEvents
                {...{events, loadingEvents, eventAssociation}}
                engageEventId={trip.engageEventId}
              />
            ) : trip.organizationId > 0 && associatedEvent.id > 0 ? (
              <CurrentAssociation
                associatedEvent={associatedEvent}
                clear={() => {
                  trip.engageEventId = 0
                  setTrip({...trip})
                }}
              />
            ) : (
              <div>
                {trip.organizationId === 0 ? (
                  <span className="text-secondary">
                    Choose an attending organization
                  </span>
                ) : (
                  <em>No association</em>
                )}
              </div>
            )}
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
      <div className="text-center">
        <button className="btn btn-success mb-2" onClick={() => tripSave()}>
          Save travel plan
        </button>
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
