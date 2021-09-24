'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Menu = ({showModal, sendSearch, search, setSearch}) => {
  return (
    <div className="mb-3">
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item mr-2">
              <button
                className="btn btn-primary mr-2"
                onClick={() => {
                  showModal()
                }}>
                Add new member
              </button>
              <a
                href="./triptrack/Admin/Member/import"
                className="btn btn-success">
                Import members
              </a>
            </li>
          </ul>
          <div className="d-flex justify-content-end">
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-success btn-sm my-2 my-sm-0"
                  onClick={sendSearch}
                  type="button">
                  Search
                </button>
                <button
                  className="btn btn-danger my-2 my-sm-0"
                  onClick={() => {
                    setSearch('')
                    sendSearch()
                  }}
                  type="button">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

Menu.propTypes = {
  showModal: PropTypes.func,
  sendSearch: PropTypes.func,
  search: PropTypes.string,
  setSearch: PropTypes.func,
  organizationLabel: PropTypes.string,
}

Menu.defaultProps = {}
export default Menu
