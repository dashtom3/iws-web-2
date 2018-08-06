import Vue from 'vue'
import Vuex from 'vuex'

import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import admin from '@/components/admin/index.vue'
import admin_user from '@/components/admin/user.vue'
import admin_role from '@/components/admin/role.vue'
import admin_system from '@/components/admin/system.vue'
import admin_point from '@/components/admin/point.vue'
import admin_login from '@/components/admin/login.vue'
import admin_sign from '@/components/admin/sign.vue'


import user from '@/components/user/index.vue'
import user_user from '@/components/user/user.vue'
import user_main from '@/components/user/main.vue'
import user_data from '@/components/user/data.vue'
import user_canvas from '@/components/user/canvas.vue'
import user_alarm from '@/components/user/alarm.vue'
import user_about from '@/components/user/about.vue'
import user_video from '@/components/user/video.vue'

import login from '@/components/user/login.vue'
import register from '@/components/user/register.vue'



Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
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
      },{
        path: '/admin/sign',
        name: 'admin_sign',
        component: admin_sign
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
        path: '/user/about',
        name: 'user_about',
        component: user_about
      },{
        path: '/user/realData/:_id',
        name: 'user_canvas',
        component: user_canvas
      },{
        path: '/user/video',
        name: 'user_video',
        component: user_video
      }]
    },{
      path: '/login',
      name: 'login',
      component: login,
    },{
      path: '/register',
      name: 'register',
      component: register,
    },{
      path: '/admin_login',
      name: 'admin_login',
      component: admin_login,
    }
  ]
})
