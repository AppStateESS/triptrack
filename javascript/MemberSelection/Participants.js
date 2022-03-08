'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const Participants = ({currentMembers, removeMember}) => {
  if (!currentMembers || currentMembers.length === 0) {
    return <div>No members assigned</div>
  }
  const memberList = currentMembers.map((value, key) => {
    return (
      <button
        className="btn btn-primary m-1"
        key={`member-${value.id}`}
        onClick={() => removeMember(key)}>
        {value.firstName} {value.lastName}
      </button>
    )
  })

  return (
    <div className="card">
      <div className="card-body">{memberList}</div>
    </div>
  )
}

Participants.propTypes = {
  currentMembers: PropTypes.array,
  removeMember: PropTypes.func,
}
export default Participants
