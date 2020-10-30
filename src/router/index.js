import Vue from 'vue'
import VueRouter from 'vue-router'

import homeConfig from '../components/ScreenBasics/HomeConfig.vue'
import home from '../components/ScreenBasics/Home.vue'
import configTheme from '../components/ScreenConfig/configTheme.vue'
import configThemeImages from '../components/ScreenConfig/configThemeImages.vue'
import configOrganizationTagGame from '../components/ScreenConfig/configOrganizationTagGame.vue'
import game from '../components/ScreenGame/Game.vue'
import setup from '../components/ScreenGame/Setup.vue'
import configDevice from '../components/ScreenConfig/configDevice.vue'

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
    name: 'HomeConfig',
    path: '/config',
    component: homeConfig
  },
  {
    name: 'Game',
    path: '/game/:theme/:config',
    component: game
  },
  {
    name: 'Home',
    path: '',
    component: home
  },
  {
    name: 'Setup',
    path: '/setup',
    component: setup
  },
  {
    name: 'Device',
    path: '/device',
    component: configDevice
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
