import Vue from 'vue'
import Router from 'vue-router'
import Map from '../components/maptest111'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map
    }
  ]
})
