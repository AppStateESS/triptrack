'use strict'
import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'
import {getList} from '../api/Fetch'

const Search = ({role, addMember, bannerIds}) => {
  const [studentBannerId, setStudentBannerId] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [lockInput, setLockInput] = useState(false)
  const [searchMember, setSearchMember] = useState(null)
  const bannerInput = useRef()

  const focusInput = () => {
    bannerInput.current.focus()
  }

  const addSearchMember = () => {
    if (bannerIds.indexOf(searchMember.bannerId) === -1) {
      addMember(searchMember)
    }
    setSearchResults(null)
    setSearchMember(null)
    setLockInput(false)
    setStudentBannerId('')
  }

  const sendSearch = () => {
    setLockInput(true)
    let url
    let param
    if (studentBannerId.match(/\d{9}/)) {
      param = {studentBannerId}
      url = `./triptrack/${role}/Member/getByBannerId`
    } else {
      param = {username: studentBannerId}
      url = `./triptrack/${role}/Member/getByUsername`
    }
    getList(url, param).then((response) => {
      if (response.data.success) {
        setSearchMember(response.data.member)
      } else {
        setSearchMember('none')
      }
      setLockInput(false)
    })
  }

  let bannerAssign
  if (searchMember === 'none') {
    bannerAssign = <div className="alert alert-info">Student not found.</div>
  } else if (searchMember !== null) {
    bannerAssign = (
      <div className="my-2 text-center">
        <button className="btn btn-primary" onClick={addSearchMember}>
          Add {searchMember.firstName} {searchMember.lastName}
        </button>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <div className="card">
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              ref={bannerInput}
              name="studentBannerId"
              placeholder="Search by username or Banner ID"
              value={studentBannerId}
              onChange={(e) => setStudentBannerId(e.target.value)}
              disabled={lockInput}
            />
            <div className="input-group-append">
              <button
                className="btn btn-success"
                disabled={lockInput}
                onClick={() => {
                  sendSearch()
                }}>
                Search
              </button>
              <button
                className="btn btn-outline-danger"
                disabled={lockInput}
                onClick={() => {
                  setSearchMember(null)
                  setStudentBannerId('')
                  focusInput()
                }}>
                Clear
              </button>
            </div>
          </div>
          {bannerAssign}
        </div>
        <div>{searchResults}</div>
      </div>
    </div>
  )
}

Search.propTypes = {
  role: PropTypes.string,
  addMember: PropTypes.func,
  bannerIds: PropTypes.array,
}
export default Search
