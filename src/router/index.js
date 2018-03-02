import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/index',
    meta: {
      roles: ['god']
    },
    children: [
      {
        path: 'permision',
        component: _import('auth/index'),
        name: 'auth',
        meta: {
          title: 'auth',
          icon: 'lock',
          noCache: true,
          roles: ['god']
        }
      }
    ]
  },

  {
    path: '/test',
    component: Layout,
    redirect: '/test/blank',
    meta: {
      roles: ['god', 'developer', 'common']
    },
    children: [{
      path: 'blank',
      component: _import('test/blank'),
      name: 'blank',
      meta: {
        title: 'blank',
        icon: 'documentation',
        noCache: true,
        roles: ['god', 'developer', 'common']
      }
    }]
  },

  {
    path: '/developer',
    component: Layout,
    redirect: '/developer/mapper',
    meta: {
      roles: ['developer', 'god']
    },
    children: [{
      path: 'mapper',
      component: _import('developer/mapper'),
      name: 'mapper',
      meta: {
        title: 'mapper',
        icon: 'lock',
        roles: ['developer', 'god']
      }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
