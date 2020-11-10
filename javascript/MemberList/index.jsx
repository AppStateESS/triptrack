'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList, sendDelete} from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import MemberForm from './MemberForm'
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
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
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
    updateUrl()
  }, [filter])

  const load = async () => {
    let response = await getList('./triptrack/Admin/Member/', filter)
    if (response === false) {
      setMessage('Error: could not load member list')
      setMessageType('danger')
      setLoading(false)
    } else {
      if (response.length > 0) {
        setMembers(response)
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

  const saveMember = () => {
    let method = currentMember.id > 0 ? 'put' : 'post'
    axios({
      method,
      url,
      data: currentMember,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const resetModal = () => {
    setCurrentMember(Object.assign({}, emptyMember))
    setShowModal(false)
  }

  const update = (varName, value) => {
    const member = Object.assign({}, currentMember)
    member[varName] = value
    setCurrentMember(member)
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

  let content = <div></div>
  if (loading) {
    content = <div>Loading members...</div>
  } else if (members.length === 0) {
    content = <div>No members found.</div>
  } else {
    content = <Grid members={members} edit={edit} deleteRow={deleteRow} />
  }

  const getModalForm = () => {
    return (
      <MemberForm
        update={update}
        member={currentMember}
        close={resetModal}
        save={saveMember}
      />
    )
  }

  const modal = (
    <Overlay show={showModal} close={resetModal} width="80%">
      <div>{getModalForm()}</div>
    </Overlay>
  )
  return (
    <div>
      <Menu
        search={search}
        setSearch={setSearch}
        sendSearch={load}
        showModal={() => setShowModal(true)}
      />
      <OrgTripSelect setFilter={setFilter} filter={filter} />
      <Message message={message} type={messageType} />
      {content}
      {modal}
    </div>
  )
}

ReactDOM.render(<MemberList />, document.getElementById('MemberList'))
