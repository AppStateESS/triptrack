'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const NoAdminOrg = ({organizationLabel}) => {
  return (
    <div>
      <h3>Sorry</h3>
      <p>
        Before you can create a trip, you must create at least one
        {organizationLabel}.
      </p>
    </div>
  )
}

NoAdminOrg.propTypes = {organizationLabel: PropTypes.string}

export default NoAdminOrg
