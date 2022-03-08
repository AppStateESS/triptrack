'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const AttendingList = ({eventAttending, bannerIds, addMember}) => {
  if (!eventAttending || eventAttending.length === 0) {
    return <div>No members found for this Engage event.</div>
  }

  const memberList = eventAttending.map((value) => {
    if (!bannerIds.includes(value.bannerId)) {
      return (
        <button
          className="btn btn-primary m-1"
          key={`member-${value.id}`}
          onClick={() => addMember(value)}>
          {value.firstName} {value.lastName}
        </button>
      )
    }
  })
  return (
    <div className="card">
      <div className="card-body">{memberList}</div>
    </div>
  )
}

AttendingList.propTypes = {
  eventAttending: PropTypes.array,
  bannerIds: PropTypes.array,
  addMember: PropTypes.func,
}
export default AttendingList
