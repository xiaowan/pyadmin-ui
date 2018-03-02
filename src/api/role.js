import request from '@/utils/request'

export function addAuthForRole(role, auths) {
  const data = {
    role,
    auths
  }
  return request({
    url: '/role/auth/add',
    method: 'post',
    data
  })
}

export function delAuthForRole(role, auths) {
  const data = {
    role,
    auths
  }
  return request({
    url: '/role/auth/del',
    method: 'post',
    data
  })
}

export function addRole(role) {
  const data = role
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}
