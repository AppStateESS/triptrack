'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class Create extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <div>Create</div>
  }
}

ReactDOM.render(<Create />, document.getElementById('Create'))
