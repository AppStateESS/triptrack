'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import List from './List'

export default class TripList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <List />
      </div>
    )
  }
}

ReactDOM.render(<TripList />, document.getElementById('TripList'))
