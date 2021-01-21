'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Host from '../TripForm/Host'
import Contact from '../TripForm/Contact'
import Submitter from '../TripForm/Submitter'
import Schedule from '../TripForm/Schedule'
import Message from '../Share/Message'
import {defaultTrip, testTrip} from '../TripForm/TripDefaults'
import axios from 'axios'

/* global allowInternational, contactBannerRequired, tripId, defaultState, defaultCountry, memberForm */

const tripSettings = {
  yes: {
    submitName: true,
    submitEmail: true,
    host: true,
    destinationCity: true,
    contactName: true,
    contactEmail: true,
    contactPhone: true,
    secContactName: true,
    secContactEmail: true,
    secContactPhone: true,
  },
  no: {
    submitName: false,
    submitEmail: false,
    host: false,
    destinationCity: false,
    contactName: false,
    contactEmail: false,
    contactPhone: false,
    secContactName: false,
    secContactEmail: false,
    secContactPhone: false,
  },
}

const Create = ({
  allowInternational,
  contactBannerRequired,
  tripId,
  defaultState,
  defaultCountry,
  memberForm,
}) => {
  defaultTrip.destinationState = defaultState
  defaultTrip.destinationCountry = defaultCountry
  testTrip.destinationState = defaultState
  testTrip.destinationCountry = defaultCountry

  const [Trip, setTrip] = useState(Object.assign({}, defaultTrip))
  //const [Trip, setTrip] = useState(Object.assign({}, testTrip))
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState(Object.assign({}, tripSettings.no))
  const [ready, setReady] = useState(Object.assign({}, tripSettings.no))
  const backup = Window.localStorage
  console.log(backup)

  const setFormElement = (key, value) => {
    backup.setItem(key, value)
    Trip[key] = value
    setTrip(Object.assign({}, Trip))
  }

  useEffect(() => {
    let url
    if (memberForm) {
      url = 'triptrack/Member/Trip/' + tripId
    } else {
      url = 'triptrack/Admin/Trip/' + tripId
    }
    if (tripId > 0) {
      axios({
        url,
        method: 'get',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then((response) => {
        setTrip(response.data)
        setReady(Object.assign({}, tripSettings.yes))
      })
    }
  }, [])

  const postTrip = () => {
    let url
    if (memberForm) {
      url = 'triptrack/Admin/Member/'
    } else {
      url = 'triptrack/Admin/Trip/'
    }

    let method = 'post'
    if (Trip.id > 0) {
      url += '/' + Trip.id
      method = 'put'
    }

    axios({
      method,
      url,
      data: Trip,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((response) => {
        backup.clear()
        location.href = 'triptrack/Admin/Trip'
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const saveReady = () => {
    return (
      ready.submitName &&
      ready.submitEmail &&
      ready.host &&
      ready.destinationCity &&
      ready.contactName &&
      ready.contactEmail &&
      ready.contactPhone &&
      ready.secContactName &&
      ready.secContactEmail &&
      ready.secContactPhone
    )
  }

  const errorCheck = (name) => {
    const emailMatch = (valueName) => {
      return Trip[valueName].match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/) === null
    }

    const phoneMatch = (valueName) => {
      return Trip[valueName].length < 7
    }

    let errorFound = false
    switch (name) {
      case 'contactPhone':
      case 'secContactPhone':
        errorFound = phoneMatch(name)
        break

      case 'contactEmail':
      case 'secContactEmail':
      case 'submitEmail':
        errorFound = emailMatch(name)
        break

      default:
        errorFound = Trip[name].length === 0
    }
    errors[name] = errorFound
    setErrors(Object.assign({}, errors))
    ready[name] = !errorFound
    setReady(Object.assign({}, ready))
  }

  let title
  if (Trip.id > 0) {
    title = <h3>Update trip</h3>
  } else {
    title = <h3>Create trip</h3>
  }

  return (
    <div>
      {title}
      <p>Please enter all requested, required information below:</p>
      <Message message={message} />
      <a id="submitter-info"></a>
      <Submitter
        Trip={Trip}
        setFormElement={setFormElement}
        errorCheck={errorCheck}
        backup={backup}
        errors={errors}
      />
      <a id="host-info"></a>
      <Host
        Trip={Trip}
        setFormElement={setFormElement}
        allowInternational={allowInternational}
        errorCheck={errorCheck}
        errors={errors}
      />
      <a id="contact-info"></a>
      <Contact
        Trip={Trip}
        setFormElement={setFormElement}
        contactBannerRequired={contactBannerRequired}
        errorCheck={errorCheck}
        errors={errors}
      />
      <a id="schedule-info"></a>
      <Schedule Trip={Trip} setFormElement={setFormElement} />
      <div className="text-center">
        <button
          className="btn btn-success"
          onClick={() => {
            postTrip()
          }}
          disabled={!saveReady()}>
          {saveReady() ? 'Save and continue' : 'Fill in all fields above'}
        </button>
      </div>
    </div>
  )
}

Create.propTypes = {
  allowInternational: PropTypes.bool,
  contactBannerRequired: PropTypes.bool,
  tripId: PropTypes.number,
  defaultState: PropTypes.string,
  defaultCountry: PropTypes.string,
}

ReactDOM.render(
  <Create
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    memberForm={memberForm}
    tripId={tripId}
    defaultState={defaultState}
    defaultCountry={defaultCountry}
  />,
  document.getElementById('Create')
)
