'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Host from '../TripForm/Host'
import Contact from '../TripForm/Contact'
import Submitter from '../TripForm/Submitter'
import Schedule from '../TripForm/Schedule'
import {defaultTrip, testTrip} from '../TripForm/TripDefaults'
import axios from 'axios'

/* global allowInternational, contactBannerRequired, tripId */

const Create = ({allowInternational, contactBannerRequired, tripId}) => {
  const [Trip, setTrip] = useState(Object.assign({}, defaultTrip))
  //const [Trip, setTrip] = useState(Object.assign({}, testTrip))
  const [submitterReady, setSubmitterReady] = useState(false)
  const [contactReady, setContactReady] = useState(false)
  const [hostReady, setHostReady] = useState(false)

  const setFormElement = (key, value) => {
    Trip[key] = value
    setTrip(Object.assign({}, Trip))
  }

  useEffect(() => {
    if (tripId > 0) {
      axios({
        url: 'triptrack/Admin/Trip/' + tripId,
        method: 'get',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then((response) => {
        setTrip(response.data)
      })
    }
  }, [])

  const postTrip = () => {
    let url = './triptrack/Admin/Trip'

    axios({
      method: 'post',
      url,
      data: Trip,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(() => {
        console.log('posted')
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const saveReady = submitterReady && contactReady && hostReady
  return (
    <div>
      <h3>Create Trip</h3>
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
      <a id="schedule-info"></a>
      <Schedule Trip={Trip} setFormElement={setFormElement} />
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
  tripId: PropTypes.number,
}

ReactDOM.render(
  <Create
    allowInternational={allowInternational}
    contactBannerRequired={contactBannerRequired}
    tripId={tripId}
  />,
  document.getElementById('Create')
)
