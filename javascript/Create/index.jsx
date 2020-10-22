'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Host from '../TripForm/Host'
import Contact from '../TripForm/Contact'
import Submitter from '../TripForm/Submitter'
import {defaultTrip} from '../TripForm/TripDefaults'

/* global allowInternational, contactBannerRequired */

const Create = ({allowInternational, contactBannerRequired}) => {
  const [Trip, setTrip] = useState(Object.assign({}, defaultTrip))
  const [submitterReady, setSubmitterReady] = useState(false)
  const [contactReady, setContactReady] = useState(false)
  const [hostReady, setHostReady] = useState(false)

  const setFormElement = (key, value) => {
    Trip[key] = value
    setTrip(Object.assign({}, Trip))
  }

  const postTrip = () => {
    console.log(Trip)
  }

  const saveReady = submitterReady && contactReady && hostReady

  return (
    <div>
      <h2>Create Trip</h2>
      <a id="submitter-info"></a>
      <Submitter
        Trip={Trip}
        setFormElement={setFormElement}
        ready={setSubmitterReady}
      />
      <a id="host-info"></a>
      <Host
        Trip={Trip}
        setFormElement={setFormElement}
        allowInternational={allowInternational}
        ready={setHostReady}
      />
      <a id="contact-info"></a>
      <Contact
        Trip={Trip}
        setFormElement={setFormElement}
        contactBannerRequired={contactBannerRequired}
        ready={setContactReady}
      />
      <div className="text-center">
        <button
          className="btn btn-success"
          onClick={() => {
            postTrip()
          }}
          disabled={!saveReady}>
          {saveReady ? 'Save and continue' : 'Fill in all fields above'}
        </button>
      </div>
    </div>
  )
}

Create.propTypes = {
  allowInternational: PropTypes.bool,
  contactBannerRequired: PropTypes.bool,
}

ReactDOM.render(
  <Create
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
  />,
  document.getElementById('Create')
)
