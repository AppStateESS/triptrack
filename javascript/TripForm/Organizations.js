'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const Organizations = ({
  Trip,
  setFormElement,
  role,
  organizationLabel,
  organizationList,
}) => {
  const [loading, setLoading] = useState(true)

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
        <label>Attending {organizationString}</label>
      </div>
      <div className="col-sm-8">
        <select
          className="form-control"
          onChange={(e) => setFormElement('organizationId', e.target.value)}
          value={Trip.organizationId}>
          {options}
        </select>
      </div>
    </div>
  )
}

Organizations.propTypes = {
  Trip: PropTypes.object,
  setFormElement: PropTypes.func,
  role: PropTypes.string,
  organizationLabel: PropTypes.string,
  organizationList: PropTypes.array,
}

export default Organizations
