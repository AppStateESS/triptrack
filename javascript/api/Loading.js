'use strict'
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Loading = ({}) => {
  return (
    <div className="mt-5">
      <p className="lead text-center">
        <FontAwesomeIcon icon="spinner" size="lg" spin />
        &nbsp;Loading...
      </p>
    </div>
  )
}

export default Loading
