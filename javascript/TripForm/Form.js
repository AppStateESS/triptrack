'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {tripSettings} from './TripDefaults'
import Host from './Host'
import Contact from './Contact'
import Submitter from './Submitter'
import Schedule from './Schedule'
import {postTrip, patchApproval} from '../api/TripAjax'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faToggleOn, faToggleOff} from '@fortawesome/free-solid-svg-icons'

const Form = ({
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
}) => {
  const [trip, setTrip] = useState(Object.assign({}, defaultTrip))
  const [errors, setErrors] = useState(Object.assign({}, tripSettings.no))
  const [allowSave, setAllowSave] = useState(true)
  const setFormElement = (key, value) => {
    //backup.setItem(key, value)
    trip[key] = value
    setTrip(Object.assign({}, trip))
    errorCheck(key, value)
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
      const promise = postTrip(trip, role)
      promise
        .then((response) => {
          if (response.data.success) {
            //backup.clear()
            const url = `triptrack/${role}/Trip/${response.data.id}`
            location.href = url
          } else {
            const errClone = response.data.errors
            const errorResult = Object.keys(errClone)
            errorResult.forEach((element) => {
              errClone[element] = true
            })
            setErrors(errClone)
          }
        })
        .catch((error) => {
          console.log('Error:', error)
        })
    }
  }

  //put in Submitter: backup={backup}
  return (
    <div>
      {title}
      <p>Please enter all requested, required information below:</p>
      {approvedIcon()}

      <a id="submitter-info"></a>
      <Submitter
        trip={trip}
        setFormElement={setFormElement}
        organizationLabel={organizationLabel}
        organizationList={organizations}
        errors={errors}
        role={role}
      />
      <a id="host-info"></a>
      <Host
        trip={trip}
        setFormElement={setFormElement}
        allowInternational={allowInternational}
        accommodationRequired={accommodationRequired}
        hostLabel={hostLabel}
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
      <div className="text-center">
        <button
          className="btn btn-success"
          onClick={saveTrip}
          disabled={!allowSave}>
          {allowSave ? 'Save and continue' : 'Fill in all fields above'}
        </button>
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
}

export default Form
