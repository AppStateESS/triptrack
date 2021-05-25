'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const NoMemberOrg = ({organizationLabel}) => {
  return (
    <div>
      <h3>Sorry</h3>
      <p>
        Before you can create a trip, you must have been assigned to a{' '}
        {organizationLabel}.
      </p>
    </div>
  )
}

NoMemberOrg.propTypes = {organizationLabel: PropTypes.string}

export default NoMemberOrg
