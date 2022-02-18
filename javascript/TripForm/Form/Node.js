'use strict'
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {toggleApproval} from './XHR'

const approvedIcon = ({trip, allowApproval, setFormElement}) => {
  if (allowApproval === false) {
    return <span></span>
  }
  if (trip.approved) {
    return (
      <div>
        <button
          onClick={() =>
            toggleApproval({toggle: false, setFormElement, tripId: trip.id})
          }
          className="btn btn-success">
          <FontAwesomeIcon icon="toggle-on" /> Approved
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <button
          onClick={() =>
            toggleApproval({toggle: true, setFormElement, tripId: trip.id})
          }
          className="btn btn-danger">
          <FontAwesomeIcon icon="toggle-off" /> Not approved
        </button>
      </div>
    )
  }
}
export {approvedIcon}
