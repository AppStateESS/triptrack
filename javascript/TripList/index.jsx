'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Menu from './Menu'
import Message from '../Share/Message'
import {getList} from '../api/Fetch'

const TripList = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    let response = await getList('./triptrack/Admin/Trip/', {search})
    if (response === false) {
      setMessage('Error: could not load trip list')
      setMessageType('danger')
      setLoading(false)
    } else {
      console.log(response)
      if (response.length > 0) {
        setTrips(response)
      }
      setLoading(false)
    }
  }
  const sendSearch = () => {
    load()
  }

  const deleteRow = () => {}

  const update = () => {}

  if (loading) {
    return <div>Loading trips...</div>
  } else if (trips.length === 0) {
    return (
      <div>
        <Message message={message} type={messageType} />
        <Menu
          showModal={() => {
            setShowModal(true)
          }}
        />
        <p>No organizations found.</p>
      </div>
    )
  } else {
    return (
      <div>
        <Menu
          search={search}
          setSearch={setSearch}
          sendSearch={sendSearch}
          showModal={() => {
            setShowModal(true)
          }}
        />
        <Message message={message} type={messageType} />
        <Grid trips={trips} edit={update} deleteRow={deleteRow} />
        {modal}
      </div>
    )
  }
}

ReactDOM.render(<TripList />, document.getElementById('TripList'))
