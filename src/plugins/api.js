import store from '@/store/index.js'

const api = {
	request() {
		let method = arguments[0]
		let url = arguments[1]
		//#ifdef APP-PLUS || MP-WEIXIN
		url = 'https://rpi.itkairui.com' + url
		//#endif
		let data = arguments[2]
		let loading = arguments[3]

		// 默认loading
		if (!loading && loading !== false) {
			loading = true
		}

		if (loading) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: method.toUpperCase(),
				data: Array.isArray(data) ? JSON.stringify(data) : data,
				header: {
					'Project': 'rpi',
					'Content-type': 'application/json',
					'Device-Type': 'web',
					'Authorization': uni.getStorageSync('accessToken') || ''
				},
				success: res => {
					uni.hideLoading()
					api.callback(res)
					resolve(res.data)
				},
				fail: res => {
					uni.hideLoading()
					api.callback(res)
					reject(res.data)
				}
			})
		})
	},
	callback(res) {
		const statusCode = res.statusCode
		let text = res.data.msg || '未知错误'
		if (statusCode === 502 || statusCode === 504) text = '服务器正在重启请稍后重试'
		else if (statusCode === 401) text = '登录信息已失效，是否重新登录？'
		else if (statusCode === 404) text = '接口不存在'
		else if (statusCode !== 200) text = '错误' + statusCode + '：' + text

		if (statusCode === 401) {
			// token已过期，静默登录
			const userInfo = uni.getStorageSync('userInfo')
			store.dispatch('loginByPassword', {
				tel: userInfo.tel,
				username: userInfo.tel,
				password: '123456'
			})
		} else if (statusCode !== 200 || !res.data.success) {
			uni.showModal({
				title: '系统提示',
				content: text,
				showCancel: false
			})
		}
	}
}

let methods = ['delete', 'get', 'post', 'put']

methods.forEach(method => {
	api[method] = function() {
		return api.request(method, ...arguments)
	}
})

export default api