'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const Menu = ({}) => {
  return (
    <div className="mb-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
            <li className="nav-item active">
              <button className="btn btn-success">Create organization</button>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Command
              </a>
            </li>
          </ul>
          <div className="d-flex justify-content-end">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit">
              Search
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

Menu.propTypes = {}

Menu.defaultProps = {}
export default Menu
