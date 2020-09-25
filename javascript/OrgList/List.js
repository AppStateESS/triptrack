'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import getList from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import Form from './Form'
import Overlay from 'canopy-react-overlay'
import 'regenerator-runtime'

const emptyOrg = {id: 0, name: ''}

const List = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentOrg, setCurrentOrg] = useState(Object.assign({}, emptyOrg))

  const load = async () => {
    let response = await getList('./triptrack/Admin/Organization/')
    if (response === false) {
      console.log('BUSTED!')
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
    console.log(currentOrg)
    setShowModal(false)
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
        <Form currentOrg={currentOrg} close={resetModal} />
      </div>
    </Overlay>
  )

  if (loading) {
    return <div>Loading organizations...</div>
  } else if (organizations.length === 0) {
    return (
      <div>
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
        <Grid organizations={organizations} />
        {modal}
      </div>
    )
  }
}

List.propTypes = {}

List.defaultProps = {}
export default List
