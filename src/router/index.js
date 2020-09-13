import Vue from 'vue'
import VueRouter from 'vue-router'

import home from '../components/ScreenBasics/Home.vue'
import configTheme from '../components/ScreenConfig/configTheme.vue'
import configThemeImages from '../components/ScreenConfig/configThemeImages.vue'
import configOrganizationTagGame from '../components/ScreenConfig/configOrganizationTagGame.vue'
import game from '../components/ScreenGame/Game.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Temas',
    path: '/temas',
    component: configTheme
  },
  {
    name: 'Organizacao',
    path: '/organizacao',
    component: configOrganizationTagGame
  },
  {
    name: 'Imagem',
    path: '/imagem',
    component: configThemeImages
  },
  {
    name: 'Home',
    path: '/home',
    component: home
  },
  {
    name: 'Game',
    path: '/',
    component: game
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
