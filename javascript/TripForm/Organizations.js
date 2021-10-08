'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Organizations = ({
  trip,
  setFormElement,
  organizationLabel,
  organizationList,
}) => {
  const organizationString =
    organizationLabel.length > 0 ? organizationLabel : 'Organization'

  let options = []
  if (organizationList.length > 0) {
    options = organizationList.map((value, key) => {
      return (
        <option key={'org-' + key} value={value.id}>
          {value.name}
        </option>
      )
    })
  }
  return (
    <div className="row form-group">
      <div className="col-sm-4">
        <label>Attending {organizationString.toLowerCase()}</label>
      </div>
      <div className="col-sm-8">
        <select
          className="form-control"
          onChange={(e) => setFormElement('organizationId', e.target.value)}
          value={trip.organizationId}>
          {options}
        </select>
      </div>
    </div>
  )
}

Organizations.propTypes = {
  trip: PropTypes.object,
  setFormElement: PropTypes.func,
  role: PropTypes.string,
  organizationLabel: PropTypes.string,
  organizationList: PropTypes.array,
  organizationId: PropTypes.number,
}

export default Organizations
