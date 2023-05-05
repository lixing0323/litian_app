import api from '@/plugins/api.js'

export default {
	getInfo({}, callback) {
		const url = '/api/user/token'
		api.get(url).then(res => {
			callback(res)
		})
	},
	sendCode({
		tel
	}, callback) {
		let url = '/api/code/tel?tel=' + tel
		api.get(url).then(res => {
			callback(res)
		})
	},
	login(model, callback) {
		const url = '/api/user/login/' + model.code
		api.post(url, model).then(res => {
			if (!res.success) return
			callback(res)
		})
	},
	loginByPassword(model, callback) {
		const url = '/api/user/login/password'
		api.post(url, model).then(res => {
			if (!res.success) return
			callback(res)
		})
	},
	changeUserInfo(model, callback) {
		let url = '/api/user/' + model.id
		api.put(url, model).then(res => {
			if (!res.success) return
			callback(res)
		})
	},
	logout({}, callback) {
		const url = '/api/user/logout'
		api.delete(url).then(res => {
			if (!res.success) return
			callback(res)
		})
	},
}