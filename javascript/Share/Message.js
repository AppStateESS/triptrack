'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const Message = ({message, type}) => {
  if (message === null) {
    return ''
  }
  return <div className={'alert alert-' + type}>{message}</div>
}

Message.propTypes = {message: PropTypes.string, type: PropTypes.string}

Message.defaultProps = {
  message: '',
  type: 'danger',
}
export default Message
