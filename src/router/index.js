import Vue from 'vue'
import Vuex from 'vuex'

import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import admin from '@/components/admin/index.vue'
import admin_user from '@/components/admin/user.vue'
import admin_role from '@/components/admin/role.vue'
import admin_system from '@/components/admin/system.vue'
import admin_point from '@/components/admin/point.vue'

import user from '@/components/user/index.vue'
import user_user from '@/components/user/user.vue'
import user_main from '@/components/user/main.vue'
import user_data from '@/components/user/data.vue'
import user_canvas from '@/components/user/canvas.vue'
import user_alarm from '@/components/user/alarm.vue'
import user_login from '@/components/user/login.vue'


Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      children: [{
        path: '/admin/user',
        name: 'admin_user',
        component: admin_user
      }, {
        path: '/admin/role',
        name: 'admin_role',
        component: admin_role
      }, {
        path: '/admin/system',
        name: 'admin_system',
        component: admin_system
      },{
        path: '/admin/point',
        name: 'admin_point',
        component: admin_point
      }]
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      children: [{
        path: '/user/main',
        name: 'user_main',
        component: user_main
      }, {
        path: '/user/data',
        name: 'user_data',
        component: user_data
      }, {
        path: '/user/user',
        name: 'user_user',
        component: user_user
      },{
        path: '/user/alarm',
        name: 'user_alarm',
        component: user_alarm
      },{
        path: '/user/canvas',
        name: 'user_canvas',
        component: user_canvas
      },{
        path: '/user/login',
        name: 'user_login',
        component: user_login
      }]
    }
  ]
})
