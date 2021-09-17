'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Menu from './Menu'
import Message from '../Share/Message'
import {getList} from '../api/Fetch'
import {deleteTrip, getIncomplete} from '../api/TripAjax'

/* global hostLabel, unapproved */

const updateSession = (dateArray) => {
  localStorage.setItem('startDate', dateArray[0].getTime())
  localStorage.setItem('endDate', dateArray[1].getTime())
}

const TripList = ({hostLabel, unapproved}) => {
  const today = new Date()
  let startRange = new Date()
  startRange.setMonth(today.getMonth() - 1)
  let endRange = new Date()
  endRange.setMonth(today.getMonth() + 1)

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('danger')
  const [search, setSearch] = useState('')
  const [unapprovedOnly, setUnapprovedOnly] = useState(unapproved)
  const [init, setInit] = useState(false)
  const [sort, setSort] = useState({column: '', dir: 0})
  const [incomplete, setIncomplete] = useState(null)
  const [dateRange, setDateRange] = useState(() => {
    const startDate = localStorage.getItem('startDate')
    const endDate = localStorage.getItem('endDate')
    if (startDate && endDate) {
      return [new Date(parseInt(startDate)), new Date(parseInt(endDate))]
    } else {
      return [startRange, endRange]
    }
  })

  let searchTimeout = useRef(null)

  useEffect(() => {
    load()
  }, [sort, dateRange])

  useEffect(() => {
    setInit(true)
  }, [])

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
    if (!init) {
      return
    }
    load()
  }, [unapprovedOnly])

  const load = (useSearch = true) => {
    setLoading(true)
    setTrips([])
    const options = {
      search: useSearch ? search : '',
      unapprovedOnly,
      startDate: Math.floor(dateRange[0].getTime() / 1000),
      endDate: Math.floor(dateRange[1].getTime() / 1000),
    }
    switch (sort.dir) {
      case 1:
        options.orderBy = sort.column
        options.dir = 'asc'
        break
      case -1:
        options.orderBy = sort.column
        options.dir = 'desc'
        break
    }
    const promise = getList('./triptrack/Admin/Trip/', options)
    promise.then((response) => {
      if (response === false) {
        setMessage('Error: could not load trip list')
        setMessageType('danger')
        setLoading(false)
      } else {
        setTrips(response.data)
        getIncomplete().then((response) => {
          if (response.data) {
            setIncomplete(response.data)
          }
        })
        setLoading(false)
      }
    })
  }

  const resetSearch = () => {
    setSearch('')
    load(false)
  }

  const deleteRow = (key) => {
    const trip = trips[key]
    deleteTrip(trip.id).then(() => {
      load()
    })
  }
  const updateDateRange = (value) => {
    if (value === null) {
      setDateRange([startRange, endRange])
      updateSession([startRange, endRange])
      localStorage.removeItem('startDate')
      localStorage.removeItem('endDate')
    } else {
      value[0].setHours(0)
      value[1].setHours(23, 59, 59)
      setDateRange(value)
      updateSession(value)
    }
  }

  const menu = (
    <Menu
      {...{
        search,
        incomplete,
        setSearch,
        sendSearch: load,
        resetSearch,
        setUnapprovedOnly,
        unapprovedOnly,
        dateRange,
        setDateRange: updateDateRange,
      }}
    />
  )
  if (loading) {
    return <div>Loading trips...</div>
  } else if (trips.length === 0) {
    let emptyMessage = (
      <span>
        No {unapprovedOnly ? 'unapproved' : ''}
        trips found.
      </span>
    )

    if (search.length > 0) {
      emptyMessage = (
        <span>
          No {unapprovedOnly ? 'unapproved' : ''}
          trips found with for search query:
          <strong>{search}</strong>.
        </span>
      )
    }
    return (
      <div>
        {menu}
        <Message message={message} type={messageType} />
        <p>{emptyMessage}</p>
      </div>
    )
  } else {
    return (
      <div>
        {menu}
        <Message message={message} type={messageType} />
        <Grid
          setSort={setSort}
          sort={sort}
          trips={trips}
          load={load}
          deleteRow={deleteRow}
          hostLabel={hostLabel}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <TripList hostLabel={hostLabel} unapproved={unapproved} />,
  document.getElementById('TripList')
)
