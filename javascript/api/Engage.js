import {getList} from './Fetch'

const orgCount = () => {
  const url = './triptrack/Admin/Engage/count'
  return getList(url)
}

const updateOrganizations = () => {
  const url = './triptrack/Admin/Engage/import'
  return getList(url)
}

const searchEngageOrganizations = (name) => {
  const url = './triptrack/Admin/Engage/search'
  return getList(url, {name})
}

export {orgCount, updateOrganizations, searchEngageOrganizations}
