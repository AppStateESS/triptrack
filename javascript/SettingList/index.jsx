'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import BigCheckbox from 'canopy-react-bigcheckbox'
import {Slide} from 'react-awesome-reveal'

const settingsDefault = {
  approvalRequired: true,
  siteContactName: '',
  siteContactEmail: '',
  hostLabel: '',
  organizationLabel: '',
  allowInternational: false,
  allowUpload: false,
  uploadRequired: false,
  uploadInstructions: '',
  contactBannerRequired: true,
}

const SettingList = () => {
  const [settings, setSettings] = useState(Object.assign({}, settingsDefault))

  const update = (settingName, value) => {
    const current = Object.assign({}, settings)
    switch (settingName) {
      case 'allowUpload':
        if (value === false) {
          current.uploadRequired = false
        }
    }
    current[settingName] = value
    setSettings(current)
  }

  const uploadRequiredRow = () => {
    if (settings.allowUpload) {
      return (
        <Slide direction="down">
          <div className="row py-2 border-bottom mb-3">
            <div className="col-sm-6 mb-2 pl-5">
              <strong>Upload required</strong>
              <br />
              If enabled, the trip is incomplete without an uploaded document.
            </div>
            <div className="col-sm-6">
              <BigCheckbox
                label={settings.uploadRequired ? 'Yes' : 'No'}
                checked={settings.uploadRequired}
                handle={() => {
                  update('uploadRequired', !settings.uploadRequired)
                }}
              />
            </div>
          </div>
          <div className="row py-2 border-bottom mb-3">
            <div className="col-sm-6 mb-2 pl-5">
              <strong>Upload notes</strong>
              <br />
              If you want any notes displayed concerning the upload, add them
              here.
            </div>
            <div className="col-sm-6">
              <textarea
                className="form-control"
                value={settings.uploadInstructions}
                onChange={(e) => update('uploadInstructions', e.target.value)}
              />
            </div>
          </div>
        </Slide>
      )
    }
  }

  return (
    <div>
      <h2>Trip Track Settings</h2>

      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Allow international</strong>
          <br />
          If enabled, other countries may be chosen as destinations.
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.allowInternational ? 'Yes' : 'No'}
            checked={settings.allowInternational}
            handle={() => {
              update('allowInternational', !settings.allowInternational)
            }}
          />
        </div>
      </div>

      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Contact banner id</strong>
          <br />
          If enabled, the trip contact&apos;s banner id number is required.
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.contactBannerRequired ? 'Yes' : 'No'}
            checked={settings.contactBannerRequired}
            handle={() => {
              update('allowInternational', !settings.contactBannerRequired)
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Approval required</strong>
          <br />
          If approval is required, a trip is not complete until approved by an
          admininstrator.
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.approvalRequired ? 'Yes' : 'No'}
            checked={settings.approvalRequired}
            handle={() => {
              update('approvalRequired', !settings.approvalRequired)
            }}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Allow uploads</strong>
          <br />
          If enabled, trips will require documentation (i.e. uploaded PDFs)
        </div>
        <div className="col-sm-6">
          <BigCheckbox
            label={settings.allowUpload ? 'Yes' : 'No'}
            checked={settings.allowUpload}
            handle={() => {
              update('allowUpload', !settings.allowUpload)
            }}
          />
        </div>
      </div>
      {uploadRequiredRow()}
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Site contact name</strong>
          <br />
          The person or department responsible for user questions.
        </div>
        <div className="col-sm-6">
          <input
            className="form-control"
            value={settings.siteContactName}
            onChange={(e) => update('siteContactName', e.target.value)}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Site contact email</strong>
          <br />
          Reply-to email address for coorespondence or questions.
        </div>
        <div className="col-sm-6">
          <input
            className="form-control"
            value={settings.siteContactEmail}
            onChange={(e) => update('siteContactEmail', e.target.value)}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Host label</strong>
          <br />
          Name used for the &quot;host&quot; of the trip (e.g. opposing team,
          chapter, etc.)
        </div>
        <div className="col-sm-6">
          <input
            placeholder='"Host" used if empty'
            className="form-control"
            value={settings.hostLabel}
            onChange={(e) => update('hostLabel', e.target.value)}
          />
        </div>
      </div>
      <div className="row py-2 border-bottom mb-3">
        <div className="col-sm-6 mb-2">
          <strong>Organization label</strong>
          <br />
          Alternate label for &quot;organization&quot; (e.g. team name,
          department, college)
        </div>
        <div className="col-sm-6">
          <input
            placeholder='"Organization" used if empty'
            className="form-control"
            value={settings.organizationLabel}
            onChange={(e) => update('organizationLabel', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<SettingList />, document.getElementById('SettingList'))
