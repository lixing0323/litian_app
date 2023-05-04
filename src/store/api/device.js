import api from '@/plugins/api.js'

export default {
  loadDeviceList({pageSize, pageNo, search}, callback) {
    let url = '/api/device?sortType=ctime_desc'
    if (pageSize) url += '&pageSize=' + pageSize + '&pageNo=' + pageNo
    if (search) url += '&search=' + search
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceTotalNum(callback) {
    let url = '/api/company/device/num'
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceErrorNum(callback) {
    let url = '/api/company/device/error/num'
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceById({id}, callback) {
    let url = '/api/device/' + id
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceParam({id}, callback) {
    let url = '/api/product/parameter/' + id
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceName({id}, callback) {
    let url = '/api/product/config/name/' + id
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceParamByName({id, productName}, callback) {
    let url = '/api/product/config/param/name/' + id + '?productName=' + productName
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  },
  loadDeviceChart({id, start, end, productName, parameterName}, callback) {
    let url = '/api/product/parameter/tendency/' + id + '?start=' + start + '&end=' + end + '&productName=' + productName
    if (parameterName) url += '&parameterName=' + parameterName
    api.get(url).then(res => {
      if (!res.success) return
      callback(res)
    })
  }
}