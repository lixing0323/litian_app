import api from '@/plugins/api.js'

export default {
  save(model, callback) {
    let url = '/api/order'
    api.post(url, model).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadList(callback) {
    let url = '/api/order'
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadById({id}, callback) {
    let url = '/api/order/' + id
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  changeOrderState(model, callback) {
    let url = '/api/order/' + model.id
    api.put(url, model).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
}