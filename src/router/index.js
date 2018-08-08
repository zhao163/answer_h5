import Vue from 'vue'
import Router from 'vue-router'
import index from '@/page/index'
import rules from '@/page/rules'
import login from '@/page/login'
import activeone from '@/page/activeone'
import activetwo from '@/page/activetwo'
import answer from '@/page/answer'
import resultone from '@/page/resultone'
import resulttwo from '@/page/resulttwo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "/index"
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/rules',
      name: 'rules',
      component: rules
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/activeone',
      name: 'activeone',
      component: activeone
    },
    {
      path: '/activetwo',
      name: 'activetwo',
      component: activetwo
    },
    {
      path: '/answer/:question',
      name: 'answer',
      component: answer
    },
    {
      path: '/resultone',
      name: 'resultone',
      component: resultone
    },
    {
      path: '/resulttwo',
      name: 'resulttwo',
      component: resulttwo
    },
    {
      path: '/',
      redirect: "/index"
    },
  ]
})
