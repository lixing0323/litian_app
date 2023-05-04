import api from '@/store/api/service'

const state = {
  orderList: [],
  orderDetail: {},
}

const getters = {
  orderList: state => state.orderList,
  orderDetail: state => state.orderDetail,
}

const mutations = {
  setOrderList: (state, value) => state.orderList = value,
  setOrderDetail: (state, value) => state.orderDetail = value,
}

const actions = {
  saveOrder({}, {type, userId, username, companyId, tel, contactTime, errorContent, isControl, callback}) {
    api.save({
      type, userId, username, companyId, tel, contactTime, errorContent, isControl,
    }, res => {
      if (callback) callback(res)
    })
  },
  loadOrderList({commit}, {callback}) {
    api.loadList(res => {
      commit('setOrderList', res.data.content)
      if (callback) callback(res)
    })
  },
  loadOrderById({commit}, {id, callback}) {
    api.loadById({
      id
    }, res => {
      commit('setOrderDetail', res.data)
      if (callback) callback(res)
    })
  },
  changeOrderState({dispatch}, {id, state, contactTime, errorContent, isControl, status, tel, type, userId, callback}) {
    api.changeOrderState({
      id, state, contactTime, errorContent, isControl, status, tel, type, userId,
    }, res => {
      dispatch('loadOrderList', {})
      if (callback) callback(res)
    })
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
