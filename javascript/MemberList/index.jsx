'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList, sendDelete} from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import MemberForm from './MemberForm'
import ImportForm from './ImportForm'
import Overlay from '@essappstate/canopy-react-overlay'
import 'regenerator-runtime'

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
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [showModal, setShowModal] = useState(false)
  const [modalFormType, setModalFormType] = useState('member')
  const [currentMember, setCurrentMember] = useState(
    Object.assign({}, emptyMember)
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    let response = await getList('./triptrack/Admin/Member/', {search})
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

  const saveMember = () => {
    console.log(currentMember)
  }

  const resetModal = () => {
    setCurrentMember(Object.assign({}, emptyMember))
    setShowModal(false)
  }

  const showModalForm = (formType) => {
    setShowModal(true)
    setModalFormType(formType)
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
    content = (
      <Grid members={members} edit={edit} deity={deity} deleteRow={deleteRow} />
    )
  }

  const getModalForm = () => {
    if (modalFormType === 'form') {
      return (
        <MemberForm
          update={update}
          member={currentMember}
          close={resetModal}
          save={saveMember}
        />
      )
    } else {
      return <ImportForm />
    }
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
        showModal={showModalForm}
      />
      {content}
      {modal}
    </div>
  )
}

ReactDOM.render(<MemberList />, document.getElementById('MemberList'))
