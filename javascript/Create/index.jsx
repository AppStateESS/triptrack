'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Host from '../TripForm/Host'
import Contact from '../TripForm/Contact'
import Submitter from '../TripForm/Submitter'

/* global allowInternational, contactBannerRequired */

const defaultTrip = {
  additionalMembers: '',
  fake: 1,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  destinationCity: '',
  destinationCountry: 'United States',
  destinationState: '',
  host: '',
  housingAddress: '',
  organizationId: 0,
  secContactName: '',
  secContactEmail: '',
  secContactPhone: '',
  submitDate: 0,
  submitEmail: '',
  submitName: '',
  submitUsername: '',
  timeDeparting: 0,
  timeEventStarts: 0,
  timeReturn: 0,
  visitPurpose: '',
}

const Create = ({allowInternational, contactBannerRequired}) => {
  const [Trip, setTrip] = useState(Object.assign({}, defaultTrip))

  const setFormElement = (key, value) => {
    Trip[key] = value
    setTrip(Object.assign({}, Trip))
  }

  const postTrip = () => {
    console.log(Trip)
  }

  return (
    <div>
      <a id="submitter-info"></a>
      <Submitter Trip={Trip} setFormElement={setFormElement} />
      <a id="host-info"></a>
      <Host
        Trip={Trip}
        setFormElement={setFormElement}
        allowInternational={allowInternational}
      />
      <a id="contact-info"></a>
      <Contact
        Trip={Trip}
        setFormElement={setFormElement}
        contactBannerRequired={contactBannerRequired}
      />
      <button
        className="btn btn-success"
        onClick={() => {
          postTrip()
        }}>
        Save and continue
      </button>
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
