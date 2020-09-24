'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Menu from './Menu'

const Grid = ({organizations}) => {
  return (
    <div>
      <div>
        <Menu />
      </div>
      <p>Grid</p>
    </div>
  )
}

Grid.propTypes = {}

Grid.defaultProps = {}
export default Grid
