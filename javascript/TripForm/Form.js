'use strict'
import React, {useState, useEffect} from 'react'
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
}) => {
  const [trip, setTrip] = useState(Object.assign({}, defaultTrip))
  const [errors, setErrors] = useState(Object.assign({}, tripSettings.no))
  const [allowSave, setAllowSave] = useState(true)
  const [members, setMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [documents, setDocuments] = useState(tripDocuments)
  const [requiredFileMissing, setRequiredFileMissing] = useState(false)

  useEffect(() => {
    getList(`./triptrack/${role}/Member`, {orgId: trip.organizationId}).then(
      (response) => {
        setMembers(response.data)
      }
    )

    if (trip.id > 0) {
      getList(`./triptrack/${role}/Trip/${trip.id}/memberList`).then(
        (response) => {
          setSelectedMembers(response.data)
        }
      )
    }
  }, [trip.organizationId])

  useEffect(() => {
    if (allowUpload && uploadRequired && documents.length === 0) {
      setRequiredFileMissing(true)
    } else {
      setRequiredFileMissing(false)
    }
  }, [documents])

  const setFormElement = (key, value) => {
    trip[key] = value
    setTrip(Object.assign({}, trip))
    errorCheck(key, value)
  }

  const cancelTrip = () => {
    if (confirm('Are you sure you want to permanently delete this trip?')) {
      deleteTrip(trip.id, 'Member')
      location.href = './triptrack/Member/Trip'
    }
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
  }

  let title
  if (trip.id > 0) {
    title = <h3>Update trip</h3>
  } else {
    title = <h3>Create trip</h3>
  }
  const finalErrorCheck = () => {
    errorCheck('contactName', trip.contactName)
    errorCheck('contactEmail', trip.contactEmail)
    errorCheck('contactPhone', trip.contactPhone)
    errorCheck('destinationCity', trip.destinationCity)
    errorCheck('host', trip.host)
    errorCheck('housingAddress', trip.housingAddress)
    errorCheck('secContactName', trip.secContactName)
    errorCheck('secContactEmail', trip.secContactEmail)
    errorCheck('secContactPhone', trip.secContactPhone)
    errorCheck('submitName', trip.submitName)
    errorCheck('submitEmail', trip.submitEmail)
  }

  const saveTrip = () => {
    finalErrorCheck()
    if (allowSave) {
      Promise.all([
        postTrip(trip, role),
        addMembersToTrip(selectedMembers, defaultTrip.id, 'Member'),
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
      {title}
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
          <a id="members"></a>
          <MemberChoice
            {...{
              members,
              organizationLabel,
              selectedMembers,
              setSelectedMembers,
            }}
          />
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
          onClick={saveTrip}
          disabled={!allowSave || requiredFileMissing}>
          {allowSave ? 'Save travel plan' : 'Fill in all fields above'}
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
}

export default Form
