'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const SaveButton = ({disabled, click, saving}) => {
  let label = <span>Save</span>
  if (saving) {
    label = (
      <span>
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Saving...
      </span>
    )
  } else {
    label = <span>Save</span>
  }
  return (
    <button
      disabled={disabled}
      className="btn btn-success"
      onClick={click}
      type="button">
      {label}
    </button>
  )
}

SaveButton.propTypes = {
  disabled: PropTypes.bool,
  click: PropTypes.func,
  saving: PropTypes.bool,
}

export default SaveButton
