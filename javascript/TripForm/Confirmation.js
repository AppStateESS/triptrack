'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import BigCheckBox from '@essappstate/canopy-react-bigcheckbox'

const Confirmation = ({
  confirmationInstructions,
  completeConfirmation,
  cancel,
}) => {
  const [confirmCheck, setConfirmCheck] = useState(false)
  return (
    <div>
      <p>
        Please read the travel conditions below. Click on the check box to
        confirm your adherence to the requirements. Your trip will not be
        approved until confirmed.
      </p>
      <div className="border p-3 mb-3">{confirmationInstructions}</div>
      <div className="mb-3">
        <BigCheckBox
          label={<span>I agree with the above conditions.</span>}
          checked={confirmCheck}
          handle={() => setConfirmCheck(true)}
        />
      </div>
      <div>
        <button
          className="btn btn-primary btn-block mb-3"
          disabled={!confirmCheck}
          onClick={() => {
            completeConfirmation(confirmCheck)
          }}>
          Save confirmation
        </button>
        <button
          className="btn btn-danger btn-block"
          onClick={() => {
            setConfirmCheck(false)
            cancel()
          }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

Confirmation.propTypes = {
  confirmationInstructions: PropTypes.string,
  completeConfirmation: PropTypes.func,
  cancel: PropTypes.func,
}

export default Confirmation
