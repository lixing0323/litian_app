import api from '@/store/api/system'

const state = {
  loading: false,
}

const getters = {
  loading: state => state.loading,
}

const mutations = {
  setLoading: (state, value) => state.loading = value,
}

const actions = {
  saveAdvice({}, {content, contact, photoList, callback}) {
    api.saveAdvice({
      content, contact, photoList,
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
