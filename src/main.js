import Vue from 'vue'
import App from './App'
import store from './store'
import tools from './plugins/tools'

Vue.config.productionTip = false

Vue.use(tools)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
