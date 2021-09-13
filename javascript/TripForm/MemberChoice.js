'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const MemberChoice = ({
  members,
  organizationLabel,
  selectedMembers,
  setSelectedMembers,
}) => {
  const pegMembers = (id) => {
    const selected = [...selectedMembers]
    const memberIdx = selected.indexOf(id)
    if (memberIdx === -1) {
      selected.push(id)
    } else {
      selected.splice(memberIdx, 1)
    }
    setSelectedMembers(selected)
  }

  let memberSelection = (
    <div>No members in selected {organizationLabel.toLowerCase()}. </div>
  )
  if (members.length > 0) {
    memberSelection = (
      <div>
        {members.map((value) => {
          const restricted = value.restricted === 1
          return (
            <div key={`member-${value.id}`}>
              <label className="lead">
                <input
                  type="checkbox"
                  name="memberId"
                  disabled={restricted}
                  value={value.id}
                  checked={selectedMembers.includes(value.id)}
                  onChange={() => pegMembers(value.id)}
                />
                &nbsp;
                {value.lastName}, {value.firstName}{' '}
                {restricted ? (
                  <span className="text-danger small">(Restricted)</span>
                ) : null}
              </label>
            </div>
          )
        })}
      </div>
    )
  }
  return (
    <div>
      <h3>Attending members</h3>
      {memberSelection}
    </div>
  )
}

MemberChoice.propTypes = {
  members: PropTypes.array,
  organizationLabel: PropTypes.string,
  selectedMembers: PropTypes.array,
  setSelectedMembers: PropTypes.func,
}

export default MemberChoice
