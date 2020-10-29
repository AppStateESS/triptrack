'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Menu from './Menu'
import Message from '../Share/Message'
import {getList} from '../api/Fetch'
import axios from 'axios'

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
      if (response.length > 0) {
        setTrips(response)
      }
      setLoading(false)
    }
  }
  const sendSearch = () => {
    load()
  }

  const deleteRow = (key) => {
    const trip = trips[key]
    const url = 'triptrack/Admin/Trip/' + trip.id
    axios({
      method: 'delete',
      url,
      timeout: 3000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(() => {
        load()
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }

  const update = () => {}

  if (loading) {
    return <div>Loading trips...</div>
  } else if (trips.length === 0) {
    return (
      <div>
        <Menu search={search} setSearch={setSearch} sendSearch={sendSearch} />
        <Message message={message} type={messageType} />
        <p>No trips found.</p>
      </div>
    )
  } else {
    return (
      <div>
        <Menu search={search} setSearch={setSearch} sendSearch={sendSearch} />
        <Message message={message} type={messageType} />
        <Grid trips={trips} edit={update} deleteRow={deleteRow} />
      </div>
    )
  }
}

ReactDOM.render(<TripList />, document.getElementById('TripList'))
