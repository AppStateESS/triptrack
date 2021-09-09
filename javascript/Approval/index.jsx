'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {patchApproval} from '../api/TripAjax'

/* global approvedStatus, tripId */

const Approval = ({approved, tripId}) => {
  const [approvedState, setApprovedState] = useState(approved)
  const approveTrip = () => {
    if (confirm('Are you sure you approve all information in this trip?')) {
      patchApproval(tripId).then(() => {
        setApprovedState(true)
      })
    }
  }
  return (
    <div>
      {approvedState ? (
        <div className="alert alert-success">Approved</div>
      ) : (
        <button className="btn btn-outline-danger" onClick={approveTrip}>
          Not approved
        </button>
      )}
    </div>
  )
}
Approval.propTypes = {
  approved: PropTypes.bool,
  tripId: PropTypes.number,
}

ReactDOM.render(
  <Approval approved={approvedStatus} tripId={tripId} />,
  document.getElementById('Approval')
)
