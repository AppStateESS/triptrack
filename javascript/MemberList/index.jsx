'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList, addMember} from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import MemberForm from './MemberForm'
import AddMemberToOrg from './AddMemberToOrg'
import AddMemberToTrip from './AddMemberToTrip'
import Overlay from '@essappstate/canopy-react-overlay'
import Message from '../Share/Message'
import OrgTripSelect from '../Share/OrgTripSelect'
import 'regenerator-runtime'
import axios from 'axios'

const emptyMember = {
  id: 0,
  bannerId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
}

const MemberList = () => {
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
  const urlParams = new URLSearchParams(window.location.search)

  const tripId =
    urlParams.get('tripId') === null ? 0 : parseInt(urlParams.get('tripId'))

  const orgId =
    urlParams.get('orgId') === null ? 0 : parseInt(urlParams.get('orgId'))

  const [filter, setFilter] = useState({orgId, tripId})

  const [search, setSearch] = useState('')

  useEffect(() => {
    loadOrganizationList()
  }, [])

  useEffect(() => {
    loadTripList(filter.orgId)
  }, [filter.orgId])

  useEffect(() => {
    updateUrl()
  }, [filter.orgId, filter.tripId])

  const loadOrganizationList = async () => {
    const response = await getList('./triptrack/Admin/Organization')
    setOrganizationList(response)
  }

  const loadTripList = async (orgId) => {
    if (orgId > 0) {
      const response = await getList('./triptrack/Admin/Trip', {
        orgId,
      })
      setTripList(response)
    }
  }

  const load = async () => {
    const data = Object.assign({}, filter)
    data.search = encodeURIComponent(search)
    let response = await getList('./triptrack/Admin/Member/', data)
    if (response === false) {
      setMessage('Error: could not load member list')
      setMessageType('danger')
      setLoading(false)
    } else {
      if (response.length > 0) {
        setMembers(response)
      } else {
        setMembers([])
      }
      setLoading(false)
    }
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
    let method
    let url = 'triptrack/Admin/Member'
    if (currentMember.id > 0) {
      method = 'put'
      url += '/' + currentMember.id
    } else {
      method = 'post'
    }

    axios({
      method,
      url,
      data: currentMember,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((resource) => {
        const memberId = resource.data.memberId
        if (orgId > 0) {
          addMember(memberId, parseInt(orgId), 0)
        }
        setShowModal(false)
        setCurrentMember(Object.assign({}, emptyMember))
        load()
      })
      .catch((error) => {
        //console.log('Error:', error)
      })
  }

  const loadMember = (bannerId) => {
    axios
      .get(
        `./triptrack/Admin/Member/getByBannerId/?studentBannerId=${bannerId}`,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'},
        }
      )
      .then((response) => {
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
    axios
      .get(`./triptrack/Admin/Member/getByUsername/?username=${username}`, {
        headers: {'X-Requested-With': 'XMLHttpRequest'},
      })
      .then((response) => {
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

  const handleSuccess = (response) => {}

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

  const deleteRow = (id) => {
    axios({
      method: 'delete',
      url: './triptrack/Admin/Member/' + id,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(() => {
        load()
      })
      .catch((error) => {
        //console.log('Error:', error)
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
      <Grid
        members={members}
        edit={edit}
        tripsExist={tripList.length > 0}
        add={assignMember}
        deleteRow={deleteRow}
        filter={filter}
      />
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

ReactDOM.render(<MemberList />, document.getElementById('MemberList'))
