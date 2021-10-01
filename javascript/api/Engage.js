import {getList, postItem} from './Fetch'

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

const postOrganization = (organization) => {
  return postItem(organization, 'Organization', 'Admin')
}

export {
  orgCount,
  updateOrganizations,
  searchEngageOrganizations,
  postOrganization,
}
