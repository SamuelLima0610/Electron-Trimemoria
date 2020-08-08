import Vue from 'vue'
import VueRouter from 'vue-router'
import configTheme from '../components/Screen/configTheme.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Temas',
    path: '/temas',
    component: configTheme
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
