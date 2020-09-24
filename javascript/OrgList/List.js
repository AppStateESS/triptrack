'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import getList from '../api/Fetch'
import Menu from './Menu'
import Grid from './Grid'
import 'regenerator-runtime'

const List = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

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

  if (loading) {
    return <div>Loading organizations...</div>
  } else if (organizations.length === 0) {
    return (
      <div>
        <Menu {...load} />
        <p>No organizations found.</p>
      </div>
    )
  } else {
    return (
      <div>
        <Grid {...organizations} />
      </div>
    )
  }
}

List.propTypes = {}

List.defaultProps = {}
export default List
