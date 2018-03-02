import request from '@/utils/request'

export function getDbs() {
  return request({
    url: '/tool/dbs',
    method: 'get'
  })
}

export function getTables(dbname) {
  return request({
    url: '/tool/tables',
    method: 'get',
    params: { dbname }
  })
}

export function getSchema(dbname, table, superclass, prefix) {
  return request({
    url: '/tool/schema',
    method: 'get',
    params: {
      dbname,
      table,
      superclass,
      prefix
    }
  })
}
