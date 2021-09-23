'use strict'
import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {tripSettings} from './TripDefaults'
import Host from './Host'
import Contact from './Contact'
import Schedule from './Schedule'
import MemberChoice from './MemberChoice'
import Documents from './Documents'
import {postTrip, patchApproval, deleteTrip} from '../api/TripAjax'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faToggleOn, faToggleOff} from '@fortawesome/free-solid-svg-icons'
import {getList} from '../api/Fetch'
import {addMembersToTrip} from '../api/TripAjax'
import Overlay from '@essappstate/canopy-react-overlay'
import Confirmation from './Confirmation'

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
  const [trip, setTrip] = useState(Object.assign({}, defaultTrip))
  const [errors, setErrors] = useState(Object.assign({}, tripSettings.no))
  const [allowSave, setAllowSave] = useState(true)
  const [members, setMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [documents, setDocuments] = useState(tripDocuments)
  const [requiredFileMissing, setRequiredFileMissing] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)

  const memberAnchor = useRef(null)

  useEffect(() => {
    let part1
    let part2

    part1 = getList(`./triptrack/${role}/Member`, {
      orgId: trip.organizationId,
    })

    if (trip.id > 0) {
      part2 = getList(`./triptrack/${role}/Trip/${trip.id}/memberList`)
    }
    Promise.all([part1, part2]).then((response) => {
      setMembers(response[0].data)
      if (response[1]) {
        setSelectedMembers(response[1].data)
      }
    })
  }, [trip.organizationId])

  useEffect(() => {
    errorCheck('memberCount')
  }, [selectedMembers])

  useEffect(() => {
    if (allowUpload && uploadRequired && documents.length === 0) {
      setRequiredFileMissing(true)
    } else {
      setRequiredFileMissing(false)
    }
  }, [documents])

  useEffect(() => {
    if (location.hash == '#members') {
      setTimeout(() => {
        memberAnchor.current.scrollIntoView()
        window.scrollTo(memberAnchor.current)
      }, 1000)
    }
  }, [])

  const setFormElement = (key, value) => {
    trip[key] = value
    setTrip(Object.assign({}, trip))
    errorCheck(key, value)
  }

  const cancelTrip = () => {
    if (confirm('Are you sure you want to permanently delete this trip?')) {
      deleteTrip(trip.id, role)
      location.href = `./triptrack/${role}/Trip`
    }
  }

  const completeConfirmation = (confirmResult) => {
    if (confirmResult) {
      saveTrip(true)
    }
    setConfirmModal(false)
  }

  const toggleApproval = (toggle) => {
    setFormElement('approved', toggle)
    if (trip.id > 0) {
      patchApproval(toggle, trip.id)
    }
  }

  const approvedIcon = () => {
    if (allowApproval === false) {
      return <span></span>
    }
    if (trip.approved) {
      return (
        <div>
          <button
            onClick={() => toggleApproval(false)}
            className="btn btn-success">
            <FontAwesomeIcon icon={faToggleOn} /> Approved
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <button
            onClick={() => toggleApproval(true)}
            className="btn btn-danger">
            <FontAwesomeIcon icon={faToggleOff} /> Not approved
          </button>
        </div>
      )
    }
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
      case 'memberCount':
        errorFound = selectedMembers.length === 0
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
    let checkSave = true
    const errorKeys = Object.keys(errors)
    errorKeys.forEach((errorName) => {
      if (errors[errorName]) {
        checkSave = false
      }
    })
    setAllowSave(checkSave)
    setErrors(Object.assign({}, errors))
    return errorFound
  }

  const finalErrorCheck = () => {
    let foundError = false
    if (errorCheck('contactName', trip.contactName)) {
      foundError = true
    }
    if (errorCheck('contactEmail', trip.contactEmail)) {
      foundError = true
    }
    if (errorCheck('contactPhone', trip.contactPhone)) {
      foundError = true
    }
    if (errorCheck('destinationCity', trip.destinationCity)) {
      foundError = true
    }
    if (errorCheck('host', trip.host)) {
      foundError = true
    }
    if (errorCheck('housingAddress', trip.housingAddress)) {
      foundError = true
    }
    if (errorCheck('secContactEmail', trip.secContactEmail)) {
      foundError = true
    }
    if (errorCheck('secContactName', trip.secContactName)) {
      foundError = true
    }
    if (errorCheck('secContactPhone', trip.secContactPhone)) {
      foundError = true
    }

    if (errorCheck('memberCount')) {
      foundError = true
    }
    return !foundError
  }

  const saveTrip = (confirmed = false) => {
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
          const url = `triptrack/${role}/Trip/${response[0].data.id}`
          location.href = url
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
  }
  return (
    <div>
      <h3>Enter trip information</h3>
      <p>Please enter all requested, required information below:</p>
      {approvedIcon()}

      <a id="submitter-info"></a>
      <fieldset className="mb-4">
        <legend className="border-bottom mb-3">Submitter</legend>
        {trip.submitName}
        <br />
        <a href={`mailto:${trip.submitEmail}`}>{trip.submitEmail}</a>
      </fieldset>

      <a id="host-info"></a>
      <Host
        trip={trip}
        setFormElement={setFormElement}
        allowInternational={allowInternational}
        accommodationRequired={accommodationRequired}
        hostLabel={hostLabel}
        organizationLabel={organizationLabel}
        organizationList={organizations}
        role={role}
        errors={errors}
      />
      <a id="contact-info"></a>
      <Contact
        trip={trip}
        setFormElement={setFormElement}
        contactBannerRequired={contactBannerRequired}
        secondaryRequired={secondaryRequired}
        errors={errors}
      />
      <a id="schedule-info"></a>
      <Schedule trip={trip} setFormElement={setFormElement} />
      <div className="row mb-5">
        <div className="col-sm-5">
          <a name="members" id="members" ref={memberAnchor}></a>
          <MemberChoice
            {...{
              members,
              organizationLabel,
              selectedMembers,
              setSelectedMembers,
            }}
          />
          {errors.memberCount ? (
            <span className="badge badge-danger">
              Select one or more members to attend
            </span>
          ) : null}
        </div>
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
        <button
          className="btn btn-success mb-2"
          onClick={() => saveTrip()}
          disabled={!allowSave || requiredFileMissing}>
          {allowSave ? 'Save travel plan' : 'Complete missing information'}
        </button>
        <div>
          {!trip.completed ? (
            <button className="btn btn-danger" onClick={cancelTrip}>
              Cancel trip
            </button>
          ) : (
            <a href={document.referrer} className="btn btn-danger">
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
