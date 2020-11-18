'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'

const ImportForm = () => {
  const [formReady, setFormReady] = useState(false)
  const [successFile, setSuccessFile] = useState('')
  let content
  if (formReady) {
    content = (
      <div className="text-center">
        <p>Import file formatted correctly.</p>
        <button className="btn btn-success btn-lg" onClick={() => {}}>
          Import members from uploaded file
        </button>
      </div>
    )
  } else {
    content = <Form {...{setFormReady, setSuccessFile}} />
  }
  return (
    <div>
      <h3>Import members</h3>
      {content}
    </div>
  )
}

ReactDOM.render(<ImportForm />, document.getElementById('ImportForm'))
