'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Organizations = ({
  trip,
  setFormElement,
  organizationLabel,
  organizationList,
  orgError,
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
        <label>{organizationString}</label>
      </div>
      <div className="col-sm-8">
        <select
          className="form-control"
          onChange={(e) => {
            setFormElement('organizationId', e.target.value)
          }}
          value={trip.organizationId}>
          <option value="0">
            Choose {organizationLabel.toLowerCase()} below
          </option>
          {options}
        </select>
        {orgError ? (
          <span className="badge badge-danger">
            Please choose the attending {organizationLabel.toLowerCase()}.
          </span>
        ) : null}
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
  orgError: PropTypes.bool,
}

export default Organizations
