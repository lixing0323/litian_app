import api from '@/store/api/device'

const state = {
  deviceList: [],
  deviceDetail: {},
  deviceParamList: [],
  deviceNameList: [],
  deviceNameParamList: [],
}

const getters = {
  deviceList: state => state.deviceList,
  deviceDetail: state => state.deviceDetail,
  deviceParamList: state => state.deviceParamList,
  deviceNameList: state => state.deviceNameList,
  deviceNameParamList: state => state.deviceNameParamList,
}

const mutations = {
  setDeviceList: (state, value) => state.deviceList = value,
  setDeviceDetail: (state, value) => state.deviceDetail = value,
  setDeviceParamList: (state, value) => state.deviceParamList = value,
  setDeviceNameList: (state, value) => state.deviceNameList = value,
  setDeviceNameParamList: (state, value) => state.deviceNameParamList = value,
}

const actions = {
  loadDeviceList({commit}, {pageSize, pageNo, search, callback}) {
    api.loadDeviceList({
      pageSize, pageNo, search
    }, res => {
      commit('setDeviceList', res.data.content)
      if (callback) callback(res)
    })
  },
  loadDeviceTotalNum({}, {callback}) {
    api.loadDeviceTotalNum(res => {
      if (callback) callback(res)
    })
  },
  loadDeviceErrorNum({}, {callback}) {
    api.loadDeviceErrorNum(res => {
      if (callback) callback(res)
    })
  },
  loadDeviceById({commit}, {id, callback}) {
    api.loadDeviceById({
      id
    }, res => {
      commit('setDeviceDetail', res.data)
      if (callback) callback(res)
    })
  },
  loadDeviceParam({commit}, {id, callback}) {
    api.loadDeviceParam({
      id
    }, res => {
      commit('setDeviceParamList', res.data.content)
      if (callback) callback(res)
    })
  },
  loadDeviceName({commit}, {id, callback}) {
    api.loadDeviceName({
      id
    }, res => {
      commit('setDeviceNameList', res.data)
      if (callback) callback(res)
    })
  },
  loadDeviceParamByName({commit}, {id, productName, callback}) {
    api.loadDeviceParamByName({
      id, productName
    }, res => {
      commit('setDeviceNameParamList', res.data)
      if (callback) callback(res)
    })
  },
  loadDeviceChart({}, {id, start, end, productName, parameterName, callback}) {
    api.loadDeviceChart({
      id, start, end, productName, parameterName
    }, res => {
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
