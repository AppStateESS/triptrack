'use strict'
import React, {useState, useEffect} from 'react'
import getList from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import Form from './Form'
import Overlay from '@essappstate/canopy-react-overlay'
import Message from '../Share/Message'

import 'regenerator-runtime'

const emptyOrg = {id: 0, name: ''}

const List = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [showModal, setShowModal] = useState(false)
  const [currentOrg, setCurrentOrg] = useState(Object.assign({}, emptyOrg))

  const load = async () => {
    let response = await getList('./triptrack/Admin/Organization/')
    if (response === false) {
      setMessage('Error: could not load organization list')
      setMessageType('danger')
      setLoading(false)
    } else {
      if (response.length > 0) {
        setOrganizations(response)
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const resetModal = () => {
    setCurrentOrg(Object.assign({}, emptyOrg))
    setShowModal(false)
  }

  const update = async (orgId) => {
    let response = await getList('./triptrack/Admin/Organization/' + orgId)
    if (response === false) {
      setMessage('Error: could not load organization')
      setMessageType('danger')
    } else {
      setCurrentOrg(response)
      setShowModal(true)
    }
  }

  const modal = (
    <Overlay
      show={showModal}
      width="90%"
      close={resetModal}
      title={
        currentOrg.id > 0 ? (
          <h4>Update organization</h4>
        ) : (
          <h4>Create organization</h4>
        )
      }>
      <div>
        <Form currentOrg={currentOrg} close={resetModal} reload={load} />
      </div>
    </Overlay>
  )

  if (loading) {
    return <div>Loading organizations...</div>
  } else if (organizations.length === 0) {
    return (
      <div>
        <Message message={message} type={messageType} />
        <Menu
          showModal={() => {
            setShowModal(true)
          }}
        />
        <p>No organizations found.</p>
        {modal}
      </div>
    )
  } else {
    return (
      <div>
        <Menu
          showModal={() => {
            setShowModal(true)
          }}
        />
        <Message message={message} type={messageType} />
        <Grid organizations={organizations} edit={update} />
        {modal}
      </div>
    )
  }
}

List.propTypes = {}

List.defaultProps = {}
export default List
