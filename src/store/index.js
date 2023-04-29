import Vue from 'vue'
import Vuex from 'vuex'
// system
import user from './modules/user'
import device from './modules/device'
import system from './modules/system'
import service from './modules/service'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const Store = new Vuex.Store({
  modules: {
    user,
    device,
    system,
    service,
  },
  strict: debug
})

export default Store
