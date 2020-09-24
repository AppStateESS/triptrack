'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import List from './List'

export default class OrgList extends Component {
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

ReactDOM.render(<OrgList />, document.getElementById('OrgList'))
