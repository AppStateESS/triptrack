'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'

export default class Create extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <Form />
      </div>
    )
  }
}

ReactDOM.render(<Create />, document.getElementById('Create'))
