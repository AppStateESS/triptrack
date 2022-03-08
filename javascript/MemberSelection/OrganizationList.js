'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const OrganizationList = ({
  organizationMembers,
  organizationLabel,
  bannerIds,
  addMember,
}) => {
  if (!organizationMembers || organizationMembers.length === 0) {
    return <div>No members found in {organizationLabel}</div>
  }
  const memberList = organizationMembers.map((value) => {
    if (!bannerIds.includes(value.bannerId)) {
      return (
        <button
          className="btn btn-primary m-1"
          key={`member-${value.id}`}
          onClick={() => addMember(value)}>
          {value.firstName} {value.lastName}
        </button>
      )
    }
  })

  return (
    <div className="card">
      <div className="card-body">{memberList}</div>
    </div>
  )
}

OrganizationList.propTypes = {
  organizationMembers: PropTypes.array,
  organizationLabel: PropTypes.string,
  bannerIds: PropTypes.array,
  addMember: PropTypes.func,
}
export default OrganizationList
