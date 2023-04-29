import api from '@/plugins/api.js'

export default {
  saveAdvice(model, callback) {
    let url = '/api/advice'
    api.post(url, model).then(res => {
      if (!res.success) return
      callback(res)
    })
  }
}