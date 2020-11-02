'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Message = ({message, type = 'danger'}) => {
  if (message === null) {
    return ''
  }
  return <div className={'text-center alert alert-' + type}>{message}</div>
}

Message.propTypes = {message: PropTypes.string, type: PropTypes.string}

export default Message
