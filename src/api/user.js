import request from '@/utils/request'

export function userInfo(uid) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { uid }
  })
}

export function userRoles(uid) {
  return request({
    url: '/user/roles',
    method: 'get',
    params: { uid }
  })
}

export function getUser() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function addUser(user) {
  const data = user
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function getRole() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function getAuth() {
  return request({
    url: '/auth/list',
    method: 'get'
  })
}

export function getAuthByRole(role) {
  return request({
    url: '/role/auths',
    method: 'get',
    params: { role }
  })
}

export function forbiddenUser(uid) {
  const data = {
    uid
  }
  return request({
    url: '/user/forbid',
    method: 'post',
    data
  })
}

export function allowUser(uid) {
  const data = {
    uid
  }
  return request({
    url: '/user/allow',
    method: 'post',
    data
  })
}

export function addRoleForUser(uid, roles) {
  const data = {
    uid,
    roles
  }
  return request({
    url: '/user/role/add',
    method: 'post',
    data
  })
}

export function delRolrForUser(uid, roles) {
  const data = {
    uid,
    roles
  }
  return request({
    url: '/user/role/del',
    method: 'post',
    data
  })
}
