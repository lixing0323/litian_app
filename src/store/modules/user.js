import api from '@/store/api/user'
import tools from "@/plugins/tools"

const state = {
	userInfo: {},
	accessToken: '',
}

const getters = {
	userInfo: state => state.userInfo,
	accessToken: state => state.accessToken
}

const mutations = {
	setUserInfo: (state, value) => {
		state.userInfo = value
		for (const key in value.metadata) {
			const keyName = key + ''
			value.metadata[keyName].forEach((e) => {
				if (!isNaN(parseInt(e.value))) e.value = parseInt(e.value)
				value.metadata[keyName + 'Fmt'] = (row, column, value) => {
					return tools.metadata.getText(keyName, value)
				}
			})
		}
		tools['metadata'] = Object.assign(tools['metadata'], value.metadata)
	},
	setAccessToken: (state, value) => state.accessToken = value
}

const actions = {
	getInfo({
		commit
	}, {
		callback
	}) {
		api.getInfo({}, res => {
			if (res.success) {
				uni.setStorageSync('userInfo', res.data)
				commit('setUserInfo', res.data)
			}
			if (callback) callback(res)
		})
	},
	saveInfo({
		commit
	}, res) {
		uni.setStorageSync('userInfo', res.data)
		uni.setStorageSync('accessToken', res.data.token)
		uni.setStorageSync('metadata', res.data.metadata)
		commit('setUserInfo', res.data)
		commit('setAccessToken', res.data.token)
	},
	login({
		commit,
		dispatch
	}, {
		tel,
		code,
		username,
		callback
	}) {
		api.login({
			tel,
			code,
			username,
		}, res => {
			dispatch('saveInfo', res)
			if (callback) callback(res)
		})
	},
	loginByPassword({
		commit,
		dispatch
	}, {
		tel,
		password,
		username,
		callback
	}) {
		api.loginByPassword({
			tel,
			password,
			username,
		}, res => {
			dispatch('saveInfo', res)
			if (callback) callback(res)
		})
	},
	sendCode({}, {
		tel,
		callback
	}) {
		api.sendCode({
			tel
		}, res => {
			if (callback) callback(res)
		})
	},
	changeUserInfo({
		dispatch
	}, {
		id,
		username,
		tel,
		photo,
		password,
		name,
		role,
		email,
		companyId,
		companyName,
		callback
	}) {
		api.changeUserInfo({
			id,
			username,
			tel,
			photo,
			password,
			name,
			role,
			email,
			companyId,
			companyName,
		}, res => {
			dispatch('getInfo', {})
			if (callback) callback(res)
		})
	},
	logout({
		commit
	}, {
		callback
	}) {
		api.logout({}, res => {
			uni.clearStorageSync()
			commit('setUserInfo', {})
			commit('setAccessToken', '')
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