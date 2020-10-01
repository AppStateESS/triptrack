'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM, {unstable_batchedUpdates} from 'react-dom'

const settingsDefault = {
  approvalRequired: true,
  siteContactName: '',
  siteContactEmail: '',
  hostLabel: '',
  organizationLabel: '',
  allowInternational: false,
  allowUpload: false,
  uploadRequired: false,
  contactBannerRequired: true,
  secondContactBannerRequired: true,
}

const SettingList = () => {
  const [settings, setSettings] = useState(Object.assign({}, settingsDefault))

  const update = (settingName, value) => {
    const current = Object.assign({}, settings)
    switch (settingName) {
      case 'allowUpload':
        console.log(value)
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
        <tr>
          <td className="w-50">
            <strong>Upload required</strong>
            <br />
            If enabled, the trip is incomplete without an uploaded document.
          </td>
          <td>
            <BigCheckbox
              label={settings.uploadRequired ? 'Yes' : 'No'}
              checked={settings.uploadRequired}
              handle={() => {
                update('uploadRequired', !settings.uploadRequired)
              }}
            />
          </td>
        </tr>
      )
    }
  }

  return (
    <div>
      <h2>Trip Track Settings</h2>
      <table className="table table-bordered table-striped">
        <tbody>
          <tr>
            <td className="w-50">
              <strong>Allow uploads</strong>
              <br />
              If enabled, trips will require documentation (i.e. uploaded PDFs)
            </td>
            <td>
              <BigCheckbox
                label={settings.allowUpload ? 'Yes' : 'No'}
                checked={settings.allowUpload}
                handle={() => {
                  update('allowUpload', !settings.allowUpload)
                }}
              />
            </td>
          </tr>
          {uploadRequiredRow()}
          <tr>
            <td className="w-50">
              <strong>Allow international</strong>
              <br />
              If enabled, other countries may be chosen as destinations.
            </td>
            <td>
              <BigCheckbox
                label={settings.allowInternational ? 'Yes' : 'No'}
                checked={settings.allowInternational}
                handle={() => {
                  update('allowInternational', !settings.allowInternational)
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="w-50">
              <strong>Approval required</strong>
              <br />
              If approval is required, a trip is not complete until approved by
              an admininstrator.
            </td>
            <td>
              <BigCheckbox
                label={settings.approvalRequired ? 'Yes' : 'No'}
                checked={settings.approvalRequired}
                handle={() => {
                  update('approvalRequired', !settings.approvalRequired)
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Site contact name</strong>
              <br />
              The person or department responsible for user questions.
            </td>
            <td>
              <input
                className="form-control"
                value={settings.siteContactName}
                onChange={(e) => update('siteContactName', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Site contact email</strong>
              <br />
              Reply-to email address for coorespondence or questions.
            </td>
            <td>
              <input
                className="form-control"
                value={settings.siteContactEmail}
                onChange={(e) => update('siteContactEmail', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Host label</strong>
              <br />
              Name used for the "host" of the trip (e.g. opposing team, chapter,
              etc.)
            </td>
            <td>
              <input
                placeholder='"Host" used if empty'
                className="form-control"
                value={settings.hostLabel}
                onChange={(e) => update('hostLabel', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Organization label</strong>
              <br />
              Alternate label for &quot;organization&quot; (e.g. team name,
              department, college)
            </td>
            <td>
              <input
                placeholder='"Organization" used if empty'
                className="form-control"
                value={settings.organizationLabel}
                onChange={(e) => update('organizationLabel', e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

ReactDOM.render(<SettingList />, document.getElementById('SettingList'))
