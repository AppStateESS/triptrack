'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const CurrentAssociation = ({associatedEvent, clear}) => {
  return (
    <div>
      <button className="btn btn-danger btn-sm" onClick={clear}>
        <span onClick={clear} className="badge badge-danger">
          <i className="fas fa-times"></i>
        </span>
      </button>
      &nbsp;
      {associatedEvent.name} -{' '}
      {new Date(associatedEvent.startsOn).toDateString()}
    </div>
  )
}

CurrentAssociation.propTypes = {
  associatedEvent: PropTypes.object,
  clear: PropTypes.func,
}

export default CurrentAssociation
