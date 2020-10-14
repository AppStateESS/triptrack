'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Host from './Host'
import Contact from './Contact'
import Submitter from './Submitter'

const defaultTrip = {
  additionalMembers: '',
  host: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  destinationCity: '',
  destinationCountry: 'United States',
  destinationState: '',
  housingAddress: '',
  organizationId: 0,
  secContactName: '',
  secContactEmail: '',
  secContactPhone: '',
  submitDate: 0,
  submitEmail: '',
  submitName: '',
  timeDeparting: 0,
  timeEventStarts: 0,
  timeReturn: 0,
  visitPurpose: '',
}

const Create = () => {
  const [Trip, setTrip] = useState(Object.assign({}, defaultTrip))

  const setFormElement = (key, value) => {
    Trip[key] = value
    setTrip(Trip)
  }

  return (
    <div>
      <a id="submitter-info"></a>
      <Submitter Trip={Trip} setFormElement={setFormElement} />
      <a id="host-info"></a>
      <Host Trip={Trip} setFormElement={setFormElement} />
      <a id="contact-info"></a>
      <Contact Trip={Trip} setFormElement={setFormElement} />
    </div>
  )
}

ReactDOM.render(<Create />, document.getElementById('Create'))
