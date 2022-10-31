'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const OrganizationList = ({
  organizationMembers,
  organizationLabel,
  bannerIds,
  addMember,
}) => {
  const [search, setSearch] = useState('')

  if (!organizationMembers || organizationMembers.length === 0) {
    return <div>No members found in {organizationLabel}</div>
  }

  const createMemberList = (listing) => {
    return listing.map((value) => {
      if (!bannerIds.includes(value.bannerId)) {
        return (
          <button
            className="btn btn-primary btn-sm m-1"
            key={`member-${value.id}`}
            onClick={() => addMember(value)}>
            {value.firstName} {value.lastName}
          </button>
        )
      }
    })
  }

  let searchedMembers = []
  let memberList
  if (search.length > 0) {
    organizationMembers.forEach((element) => {
      const searchExp = new RegExp(search, 'gi')
      if (
        element.email.match(searchExp) !== null ||
        element.firstName.match(searchExp) !== null ||
        element.lastName.match(searchExp) !== null
      ) {
        searchedMembers.push(element)
      }
    })
    memberList = createMemberList(searchedMembers)
  } else {
    memberList = createMemberList(organizationMembers)
  }

  return (
    <div>
      <div>
        <div className="input-group mb-3">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            value={search}
            placeholder="Search..."
          />
          <div className="input-group-append">
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => setSearch('')}>
              Clear
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body overflow-auto" style={{maxHeight: '400px'}}>
          {memberList}
        </div>
      </div>
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
