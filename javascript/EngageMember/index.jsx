'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getOrganizationList} from '../api/Engage'
import MapList from './MapList'
import PropTypes from 'prop-types'

/* global engageId, orgName, organizationLabel, orgId */
const EngageMember = ({engageId, orgName, organizationLabel, orgId}) => {
  const [memberList, setMemberList] = useState([])
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState([])
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    getOrganizationList(engageId).then((response) => {
      setMemberList(response.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (checkAll) {
      const checkScale = []
      for (let i = 0; i < memberList.length; i++) {
        checkScale.push(i)
      }
      setChecked(checkScale)
    } else {
      setChecked([])
    }
  }, [checkAll])

  const updateChecked = (key) => {
    const idx = checked.indexOf(key)
    if (idx == -1) {
      checked.push(key)
    } else {
      checked.splice(idx, 1)
    }
    setChecked([...checked])
  }

  return (
    <div>
      <h3 className="mb-3">Import Engage members from {orgName}</h3>
      {loading ? (
        <div>Getting member list...</div>
      ) : memberList.length === 0 ? (
        <p>No members found for this {organizationLabel}</p>
      ) : (
        <MapList
          {...{
            orgId,
            memberList,
            checked,
            updateChecked,
            checkAll,
            setCheckAll,
            organizationLabel,
          }}
        />
      )}
    </div>
  )
}
EngageMember.propTypes = {
  engageId: PropTypes.number,
  orgName: PropTypes.string,
  organizationLabel: PropTypes.string,
  orgId: PropTypes.number,
}

ReactDOM.render(
  <EngageMember
    orgName={orgName}
    orgId={orgId}
    engageId={engageId}
    organizationLabel={organizationLabel}
  />,
  document.getElementById('EngageMember')
)