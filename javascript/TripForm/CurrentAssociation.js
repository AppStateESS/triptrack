'use strict'
import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

const CurrentAssociation = ({associatedEvent, clear}) => {
  return (
    <Fragment>
      <button className="btn btn-danger btn-sm" onClick={clear}>
        <span onClick={clear} className="badge badge-danger">
          <i className="fas fa-times"></i>
        </span>
      </button>
      &nbsp;
      {associatedEvent.name.substr(0, 40)} -{' '}
      {new Date(associatedEvent.startsOn).toDateString()}
    </Fragment>
  )
}

CurrentAssociation.propTypes = {
  associatedEvent: PropTypes.object,
  clear: PropTypes.func,
}

export default CurrentAssociation
