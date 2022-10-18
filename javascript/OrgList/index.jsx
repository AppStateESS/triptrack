'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {getList, sendDelete} from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import Form from './Form'
import Overlay from '@essappstate/canopy-react-overlay'
import Message from '../Share/Message'
import 'regenerator-runtime'
import PropTypes from 'prop-types'

/* global engageUrl, organizationLabel, forceEngageOrg */

const emptyOrg = {id: 0, name: ''}

const OrgList = ({engageUrl, organizationLabel, forceEngageOrg}) => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [init, setInit] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [showModal, setShowModal] = useState(false)
  const [currentOrg, setCurrentOrg] = useState(Object.assign({}, emptyOrg))
  const [search, setSearch] = useState('')
  const searchTimeout = useRef(null)

  const load = async () => {
    setLoading(true)
    let response = await getList('./triptrack/Admin/Organization/', {search})
    if (response === false) {
      setMessage('Error: could not load organization list')
      setMessageType('danger')
      setLoading(false)
    } else {
      if (response.data.length > 0) {
        setOrganizations(response.data)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!init) {
      return
    }
    if (search.length > 3 || search.length === 0) {
      searchTimeout.current = setTimeout(() => {
        load()
      }, 1000)
    }
    return () => {
      clearTimeout(searchTimeout.current)
    }
  }, [search])

  useEffect(() => {
    load()
    setInit(true)
  }, [])

  const sendSearch = () => {
    load()
  }

  const deleteRow = async (key) => {
    const url = './triptrack/Admin/Organization/' + organizations[key].id
    let response = await sendDelete(url)
    if (response === false) {
      setMessage('Error: could not delete organization')
      setMessageType('danger')
      setLoading(false)
    } else {
      load()
    }
  }

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
      setCurrentOrg(response.data)
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
        <Form
          currentOrg={currentOrg}
          close={resetModal}
          reload={load}
          forceEngageOrg={forceEngageOrg}
        />
      </div>
    </Overlay>
  )

  if (loading) {
    return <div>Loading {organizationLabel}s...</div>
  } else if (organizations.length === 0) {
    return (
      <div>
        <Message message={message} type={messageType} />
        <Menu
          showModal={() => {
            setShowModal(true)
          }}
        />
        <p>No {organizationLabel.toLowerCase()}s found.</p>
        {modal}
      </div>
    )
  } else {
    return (
      <div>
        <Menu
          search={search}
          organizationLabel={organizationLabel}
          setSearch={setSearch}
          sendSearch={sendSearch}
          showModal={() => {
            setShowModal(true)
          }}
        />
        <Message message={message} type={messageType} />
        <Grid
          organizations={organizations}
          edit={update}
          engageUrl={engageUrl}
          deleteRow={deleteRow}
        />
        {modal}
      </div>
    )
  }
}

OrgList.propTypes = {
  organizationLabel: PropTypes.string,
  engageUrl: PropTypes.string,
  forceEngageOrg: PropTypes.bool,
}

ReactDOM.render(
  <OrgList
    engageUrl={engageUrl}
    forceEngageOrg={forceEngageOrg}
    organizationLabel={organizationLabel}
  />,
  document.getElementById('OrgList')
)
