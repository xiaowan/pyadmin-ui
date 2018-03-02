import request from '@/utils/request'

export function newAuths() {
  return request({
    url: '/auth/newauths',
    method: 'get'
  })
}

export function addAuth(name, auth) {
  const data = {
    name,
    auth
  }
  return request({
    url: '/auth/add',
    method: 'post',
    data
  })
}

export function canAssignAuths() {
  return request({
    url: '/auth/canassign',
    method: 'get'
  })
}
