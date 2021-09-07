'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import {
  addMember,
  deleteMember,
  dropFromOrg,
  dropFromTrip,
  loadByBannerId,
  loadByUsername,
  save,
} from '../api/MemberAjax'
import Menu from './Menu'
import Grid from './Grid'
import MemberForm from './MemberForm'
import AddMemberToOrg from './AddMemberToOrg'
import AddMemberToTrip from './AddMemberToTrip'
import Overlay from '@essappstate/canopy-react-overlay'
import Message from '../Share/Message'
import OrgTripSelect from '../Share/OrgTripSelect'
import PropTypes from 'prop-types'

/* global organizationLabel */

const emptyMember = {
  id: 0,
  bannerId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
}

const MemberList = ({organizationLabel}) => {
  const [organizationList, setOrganizationList] = useState([])
  const [tripList, setTripList] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('member')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [formMessage, setFormMessage] = useState(null)
  const [currentMember, setCurrentMember] = useState(
    Object.assign({}, emptyMember)
  )
  const [sort, setSort] = useState({column: '', dir: 0})
  const [tripApproved, setTripApproved] = useState(false)
  const urlParams = new URLSearchParams(window.location.search)

  const tripId =
    urlParams.get('tripId') === null ? 0 : parseInt(urlParams.get('tripId'))

  const orgId =
    urlParams.get('orgId') === null ? 0 : parseInt(urlParams.get('orgId'))

  const [filter, setFilter] = useState({orgId, tripId})

  const [search, setSearch] = useState('')

  useEffect(() => {
    getList('./triptrack/Admin/Organization').then((response) => {
      const orgData = response.data
      setOrganizationList(orgData)
    })
  }, [])

  useEffect(() => {
    load()
  }, [sort])

  useEffect(() => {
    if (filter.orgId > 0) {
      loadTripList(filter.orgId).then((response) => {
        setTripList(response.data)
      })
    }
  }, [filter.orgId])

  useEffect(() => {
    tripList.forEach((trip) => {
      if (filter.tripId == trip.id) {
        setTripApproved(trip.approved == 1)
      }
    })
  }, [filter.tripId, tripList])

  useEffect(() => {
    updateUrl()
  }, [filter.orgId, filter.tripId])

  const loadTripList = (orgId) => {
    return getList('./triptrack/Admin/Trip', {
      orgId,
    })
  }

  const load = () => {
    const data = Object.assign({}, filter)
    data.search = encodeURIComponent(search)
    switch (sort.dir) {
      case 1:
        data.orderBy = sort.column
        data.dir = 'asc'
        break
      case -1:
        data.orderBy = sort.column
        data.dir = 'desc'
        break
    }
    getList('./triptrack/Admin/Member/', data).then((response) => {
      if (response === false) {
        setMessage('Error: could not load member list')
        setMessageType('danger')
        setLoading(false)
      } else {
        if (response.data.length > 0) {
          setMembers(response.data)
        } else {
          setMembers([])
        }
        setLoading(false)
      }
    })
  }

  const updateUrl = () => {
    let url = './triptrack/Admin/Member/'

    if (filter.orgId > 0) {
      url += `?orgId=${filter.orgId}`
      if (filter.tripId > 0) {
        url += `&tripId=${filter.tripId}`
      }
    }

    window.history.pushState('stateObj', 'new page', url)
    load()
  }

  const saveMember = (orgId = 0) => {
    save(currentMember).then((resource) => {
      const memberId = resource.data.memberId
      if (orgId > 0) {
        addMember(memberId, parseInt(orgId), 0)
      }
      setShowModal(false)
      setCurrentMember(Object.assign({}, emptyMember))
      load()
    })
  }

  const loadMember = (bannerId) => {
    loadByBannerId.then((response) => {
      if (response.data.success) {
        if (response.data.status === 'banner') {
          setFormMessage(
            <span>
              Student in Banner but <strong>not saved</strong> to the system.
            </span>
          )
        } else if (response.data.status === 'system') {
          setFormMessage(
            <span>
              Student already in the system. Update their info or cancel.
            </span>
          )
        }
        setCurrentMember(response.data.member)
      } else {
        setCurrentMember({
          id: 0,
          bannerId,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          username: '',
        })
      }
    })
  }

  const loadMemberByUsername = (username) => {
    loadByUsername.then((response) => {
      if (response.data.success) {
        if (response.data.status === 'banner') {
          setFormMessage(
            <span>
              Student in Banner but <strong>not saved</strong> to the system.
            </span>
          )
        } else if (response.data.status === 'system') {
          setFormMessage(
            <span>
              Student already in the system. Update their info and save or
              cancel.
            </span>
          )
        }
        setCurrentMember(response.data.member)
      } else {
        setCurrentMember({
          id: 0,
          bannerId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          username,
        })
      }
    })
  }

  const resetModal = () => {
    setCurrentMember(Object.assign({}, emptyMember))
    setShowModal(false)
    setModalType('member')
    setFormMessage(null)
  }

  const update = (varName, value) => {
    const member = Object.assign({}, currentMember)
    member[varName] = value
    setCurrentMember(member)
  }

  const dropMemberFromTrip = (memberId, tripId) => {
    dropFromTrip(memberId, tripId).then(() => {
      load()
    })
  }
  const dropMemberFromOrg = (memberId, orgId) => {
    dropFromOrg(memberId, orgId).then(() => {
      load()
    })
  }

  const deleteRow = (id) => {
    deleteMember(id).then(() => {
      load()
    })
  }

  const edit = async (memberId) => {
    let response = await getList('./triptrack/Admin/Member/' + memberId)
    if (response === false) {
      setMessage('Error: could not load member')
      setMessageType('danger')
    } else {
      setCurrentMember(response)
      setShowModal(true)
    }
  }

  const emptyMessage = () => {
    if (filter.tripId > 0) {
      return 'No members found in this trip.'
    } else if (filter.orgId > 0) {
      return 'No members found in this organization.'
    } else {
      return 'No members found.'
    }
  }

  const assignMember = (key) => {
    setShowModal(true)
    setModalType('add')
    setCurrentMember(Object.assign({}, members[key]))
  }

  let content = <div></div>
  if (loading) {
    content = <div>Loading members...</div>
  } else if (members.length === 0) {
    content = <div>{emptyMessage()}</div>
  } else {
    content = (
      <div>
        <div className="text-center">
          {filter.tripId > 0 ? (
            tripApproved ? (
              <span className="badge badge-success mb-2">Trip approved</span>
            ) : (
              <span className="badge badge-danger mb-2">Trip not approved</span>
            )
          ) : null}
        </div>
        <div>
          <Grid
            members={members}
            edit={edit}
            tripsExist={tripList.length > 0}
            add={assignMember}
            deleteRow={deleteRow}
            dropMemberFromTrip={dropMemberFromTrip}
            dropMemberFromOrg={dropMemberFromOrg}
            tripApproved={tripApproved}
            selectedTripId={tripId}
            selectedOrgId={orgId}
            load={load}
            filter={filter}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </div>
    )
  }

  const getModalForm = () => {
    if (modalType === 'member') {
      return (
        <MemberForm
          update={update}
          member={currentMember}
          close={resetModal}
          saveMember={saveMember}
          formMessage={formMessage}
          loadMemberByUsername={loadMemberByUsername}
          organizationList={organizationList}
          loadMember={loadMember}
        />
      )
    } else if (filter.orgId > 0) {
      return (
        <AddMemberToTrip
          member={currentMember}
          organizationId={filter.orgId}
          tripList={tripList}
          addMember={(tripId) => {
            addMember(currentMember.id, filter.orgId, tripId)
            resetModal()
          }}
          close={resetModal}
        />
      )
    } else {
      return (
        <AddMemberToOrg
          member={currentMember}
          organizationList={organizationList}
          addMember={(orgId) => {
            addMember(currentMember.id, orgId, 0)
            resetModal()
          }}
          close={resetModal}
        />
      )
    }
  }

  const modal = () => {
    return (
      <Overlay show={showModal} close={resetModal} width="80%">
        <div>{getModalForm()}</div>
      </Overlay>
    )
  }

  return (
    <div>
      <Menu
        organizationLabel={organizationLabel}
        search={search}
        setSearch={setSearch}
        sendSearch={load}
        showModal={() => setShowModal(true)}
      />
      <div className="row">
        <div className="col-sm-2 align-self-center">Search by:</div>
        <div className="col-sm-10">
          <OrgTripSelect
            setFilter={setFilter}
            filter={filter}
            organizationLabel={organizationLabel}
            organizations={organizationList}
            trips={tripList}
          />
        </div>
      </div>
      <Message message={message} type={messageType} />
      {content}
      {modal()}
    </div>
  )
}
MemberList.propTypes = {
  organizationLabel: PropTypes.string,
}

ReactDOM.render(
  <MemberList organizationLabel={organizationLabel} />,
  document.getElementById('MemberList')
)
