<template>
	<view class="device-charts-page">
		<view class="head">
			<view class="head-box">
				<view class="time-box">
					<view class="time-text">
						<text>开始时间</text>
						<text>结束时间</text>
					</view>
					<view class="time-picker">
						<picker class="picker" mode="date" :value="query.start" @change="changeStartDate">
							<view class="time">{{query.start}}</view>
						</picker>
						<picker class="picker" mode="time" :value="query.startTime" @change="changeStartTime">
							<view class="time">{{query.startTime}}</view>
						</picker>
						<image src="/static/images/icon/dash.png"></image>
						<picker class="picker" mode="date" :value="query.end" @change="changeEndDate">
							<view class="time">{{query.end}}</view>
						</picker>
						<picker class="picker" mode="time" :value="query.endTime" @change="changeEndTime">
							<view class="time">{{query.endTime}}</view>
						</picker>
					</view>
				</view>
				<view class="picker-list">
					<view class="picker-item">
						<view class="text middle-block">产品</view>
						<picker class="picker middle-block" :range="deviceNameList" :value="nameIdx" @change="changeName">
							<view class="item-text" v-if="deviceNameList.length > 0">{{deviceNameList[nameIdx]}}</view>
							<view class="item-text" v-else>暂无产品</view>
						</picker>
					</view>
					<view class="picker-item">
						<view class="text middle-block">参数</view>
						<picker class="picker middle-block" :range="deviceNameParamList" :value="paramIdx" @change="changeParam">
							<view class="item-text" v-if="deviceNameParamList.length > 0">{{deviceNameParamList[paramIdx]}}</view>
							<view class="item-text" v-else>暂无参数</view>
						</picker>
					</view>
				</view>
				<view class="chart-btn">
					<text class="btn" :class="{'active-btn': activeBtn === 1}" @click="changeBtn(1)">1h</text>
					<text class="btn" :class="{'active-btn': activeBtn === 8}" @click="changeBtn(8)">8h</text>
					<text class="btn" :class="{'active-btn': activeBtn === 12}" @click="changeBtn(12)">12h</text>
					<text class="btn" :class="{'active-btn': activeBtn === 24}" @click="changeBtn(24)">24h</text>
				</view>
				<view class="limit-list form">
					<view class="form-item">
						<view class="left-content">
							<text class="text">实时更新</text>
						</view>
						<view class="right-content">
							<switch @change="switchChange" />
						</view>
					</view>
					<view class="form-item">
						<view class="left-content">
							<text class="text">y轴最大值</text>
						</view>
						<view class="right-content">
							<input type="number" v-model="yMax" class="input" placeholder="请输入">
						</view>
					</view>
					<view class="form-item">
						<view class="left-content">
							<text class="text">y轴最小值</text>
						</view>
						<view class="right-content">
							<input type="number" v-model="yMin" class="input" placeholder="请输入">
						</view>
					</view>
				</view>
				<view class="submit-btn" @click="loadCharts(true)">确定</view>
			</view>
		</view>

		<view class="charts-box" v-if="chartData.result.length > 0">

			<view class="charts-text">
				<view>最大值：{{chartData.statistics.maxVal}}</view>
				<view>最小值：{{chartData.statistics.minVal}}</view>
				<view>平均值：{{chartData.statistics.avgVal}}</view>
				<view>合格率：{{chartData.statistics.rate}}%</view>
			</view>
			<view class="charts" :style="{'height':cHeight*pixelRatio + 'px'}">
				<qiun-data-charts type="line" :canvas2d="true" :opts="opts" :chartData="qiunData" />
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	let _self = null;
	let canvaColumn = null;
	export default {
		data() {
			return {
				id: '',
				startTime: '',
				endTime: '',
				yMax: '',
				yMin: '',
				query: {
					start: '',
					startTime: '',
					end: '',
					endTime: '',
					productName: '',
					parameterName: '',
				},
				activeBtn: 0,
				nameIdx: 0,
				paramIdx: 0,
				chartData: {
					result: []
				},
				qiunData: [],
				opts: {
					timing: "easeOut",
					duration: 1000,
					rotate: false,
					update: true,
					rotateLock: false,
					padding: [15, 10, 0, 15],
					fontSize: 12,
					fontColor: "#666666",
					background: '#FFFFFF',
					dataLabel: true,
					enableScroll: true, // 开启滚动条，X轴配置里需要配置itemCount单屏幕数据点数量
					enableMarkLine: true, // 是否启用标记线功能
					disableScroll: true, // 在图表上滑动时禁止页面滚动。开启后，触摸图表时将会禁止屏幕滚动以及下拉刷新
					dataLabel: false, // 是否在图表中显示标注，默认为true
					dataPointShape: false, // 是否在图表中显示数据点图形标识
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						disabled: false,
						axisLine: true,
						calibration: true,
						fontSize: 10,
						marginTop: 10,
						rotateLabel: true,
						rotateAngle: 70,
						itemCount: 25, //可见区域数据数量
						labelCount: 10, //可见区域标签数量
						scrollShow: false
					},
					yAxis: {
						splitNumber: 10,
						showTitle: false,
						data: []
					},
					extra: {
						line: {
							type: 'curve',
							width: 2,
							activeType: "hollow",
							linearType: "custom"
						},
						tooltip: {
							showBox: true,
							legendShow: false,
							splitLine: true,
							horizentalLine: false
						},
					},
				},
				xAxis: [],
				yAxis: [],
				pixelRatio: 1,
				cWidth: '',
				cHeight: '',
				realTimeUpdateFlag: false,
				realTimer: '',
			}
		},
		computed: {
			...mapGetters([
				'deviceNameParamList',
				'deviceNameList',
			])
		},
		watch: {
			realTimeUpdateFlag(val, old) {
				if (val) {
					if (this.realTimer) {
						clearInterval(this.realTimer)
					}
					this.realTimer = setInterval(() => {
						this.changeBtn(1)
						this.loadCharts(false)
					}, 10000)
				} else {
					if (this.realTimer) {
						clearInterval(this.realTimer)
					}
				}
			},
		},
		onLoad(option) {
			this.id = option.id
			this.init()
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					// this.cHeight = (res.screenHeight * 0.9) / 2 - 40
					this.cHeight = res.screenHeight - 90 - 100
					this.cWidth = res.screenWidth - 20
				}
			})
			_self = this
			this.changeBtn(1)
		},
		beforeDestroy() {
			if (this.realTimer) {
				clearInterval(this.realTimer)
			}
		},
		onUnload() {
			if (this.realTimer) {
				clearInterval(this.realTimer)
			}
		},
		methods: {
			...mapActions([
				'loadDeviceChart',
				'loadDeviceName',
				'loadDeviceParamByName',
			]),
			changeStartDate(e) {
				this.query.start = e.detail.value
				this.activeBtn = 0
			},
			changeEndDate(e) {
				this.query.end = e.detail.value
				this.activeBtn = 0
			},
			changeStartTime(e) {
				this.query.startTime = e.detail.value
				this.activeBtn = 0
			},
			changeEndTime(e) {
				this.query.endTime = e.detail.value
				this.activeBtn = 0
			},
			parseTime(time, cFormat) {
				if (arguments.length === 0) {
					return null
				}
				const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
				let date
				if (typeof time === 'object') {
					date = time
				} else {
					if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
						time = parseInt(time)
					}
					if ((typeof time === 'number') && (time.toString().length === 10)) {
						time = time * 1000
					}
					date = new Date(time)
				}
				const formatObj = {
					y: date.getFullYear(),
					m: date.getMonth() + 1,
					d: date.getDate(),
					h: date.getHours(),
					i: date.getMinutes(),
					s: date.getSeconds(),
					a: date.getDay()
				}
				const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
					const value = formatObj[key]
					// Note: getDay() returns 0 on Sunday
					if (key === 'a') {
						return ['日', '一', '二', '三', '四', '五', '六'][value]
					}
					return value.toString().padStart(2, '0')
				})
				return time_str
			},
			getTime(i) {
				let now = new Date()
				let startTime = new Date(now.getTime() - i * 3600000)
				// format
				this.query.start = this.parseTime(startTime, '{y}-{m}-{d}')
				this.query.startTime = this.parseTime(startTime, '{h}:{i}')
				this.query.end = this.parseTime(now, '{y}-{m}-{d}')
				this.query.endTime = this.parseTime(now, '{h}:{i}')
				this.startTime = this.parseTime(startTime)
				this.endTime = this.parseTime(now)
			},
			init() {
				this.loadDeviceName({
					id: this.id,
					callback: res => {
						// 从本地读取数据
						this.loadConfigInfoFromStorage()
						// 设备信息
						if (this.deviceNameList.length > 0) {
							if (this.query.productName) {
								this.nameIdx = this.deviceNameList.findIndex(item => item === this.query.productName)
							} else {
								this.query.productName = this.deviceNameList[0]
							}
						}
						// api
						this.loadDeviceParamByName({
							id: this.id,
							productName: this.query.productName,
							callback: res => {
								if (this.deviceNameParamList.length > 0) {
									if (this.query.parameterName) {
										this.paramIdx = this.deviceNameParamList.findIndex(item => item === this.query
											.parameterName)
									} else {
										this.query.parameterName = this.deviceNameParamList[0]
									}
								}
							}
						})
					}
				})
			},
			changeBtn(i) {
				this.activeBtn = i
				this.getTime(i)
			},
			isValidY(y) {
				return y || y === 0
			},
			checkValidate() {
				let msg
				if (!this.query.productName || !this.query.parameterName) {
					msg = '请先选择产品和参数'
				} else if (this.isValidY(this.yMin) && this.isValidY(this.yMax)) {
					if (Number(this.yMin) > Number(this.yMax)) {
						msg = 'y轴最小值不能超过y轴最大值'
					}
				}

				if (msg) {
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				}

				return !msg
			},
			resetEChartsOption() {
				const data = []
				this.opts.extra.markLine = {
					type: "dash",
					dashLength: 4,
					data: data
				}
				if (this.isValidY(this.yMin)) {
					data.push({
						value: this.yMin,
						lineColor: "#0000FF",
						showLabel: true
					})
				}
				if (this.isValidY(this.yMax)) {
					data.push({
						value: this.yMax,
						lineColor: "#FF0000",
						showLabel: true
					})
				}
			},
			saveConfigInfo() {
				const data = {
					start: this.query.start,
					end: this.query.end,
					startTime: this.query.startTime,
					endTime: this.query.endTime,
					productName: this.query.productName,
					parameterName: this.query.parameterName,
					yMax: this.yMax,
					yMin: this.yMin,
					activeBtn: this.activeBtn
				}
				uni.setStorageSync('device-query-params', JSON.stringify(data))
			},
			loadConfigInfoFromStorage() {
				try {
					const value = uni.getStorageSync('device-query-params');
					if (value) {
						const data = JSON.parse(value)
						this.query.start = data.start
						this.query.end = data.end
						this.query.startTime = data.startTime
						this.query.endTime = data.endTime
						this.query.productName = data.productName
						this.query.parameterName = data.parameterName
						this.yMin = data.yMin
						this.yMax = data.yMax
						this.activeBtn = data.activeBtn
					}
				} catch (e) {
					// error
				}
			},
			loadCharts(loading = false) {
				// 校验数据
				if (!this.checkValidate()) {
					return
				}
				// 重新配置参数
				this.resetEChartsOption()
				// 存储配置信息
				this.saveConfigInfo()
				// 获取服务器数据
				this.loadDeviceChart({
					id: this.id,
					start: this.query.start + ' ' + this.query.startTime + ':00',
					end: this.query.end + ' ' + this.query.endTime + ':00',
					productName: this.query.productName,
					parameterName: this.query.parameterName,
					loading: loading,
					callback: res => {
						this.xAxis = []
						this.yAxis = []
						if (res.data.content.length > 0) {
							this.chartData = res.data.content[0]
							this.chartData.statistics.maxVal = this.chartData.statistics.max.toFixed(this.chartData
								.statistics
								.decimalDigits)
							this.chartData.statistics.minVal = this.chartData.statistics.min.toFixed(this.chartData
								.statistics
								.decimalDigits)
							this.chartData.statistics.avgVal = this.chartData.statistics.avg.toFixed(this.chartData
								.statistics
								.decimalDigits)
							let result = this.chartData.result
							let y = [],
								highY = [],
								lowY = []
							let index = 0
							result.forEach(e => {
								let list = e.ctime.split(' ')
								let dateList = list[0].split('-')
								let timeList = list[1].split(':')
								let date = dateList[1] + '.' + dateList[2] + ' ' + timeList[0] + ':' + timeList[1] + ':' +
									timeList[2]
								this.xAxis.push(date)
								// 如果填写了最大值
								// if (this.yMax || this.yMax === 0) {

								// }
								// if ((this.yMax || this.yMax === 0) && e.value > this.yMax) {
								// 	y.push(this.yMax)
								// } else if ((this.yMin || this.yMin === 0) && e.value < this.yMin) {
								// 	y.push(this.yMin)
								// } else {
								// 	y.push(e.value)
								// }

								y.push(e.value)
							})
							// 超过上限=红色 #FF0000， 低于下限=蓝色 #0000FF	
							this.yAxis = [{
								name: '', // 必传！！！！！！
								data: y,
							}]
							this.initLine()
						} else {
							uni.showToast({
								title: '暂无数据',
								icon: 'none'
							})
						}
					}
				})
			},
			changeName(e) {
				this.nameIdx = e.detail.value
				this.query.productName = this.deviceNameList[this.nameIdx]
				this.loadDeviceParamByName({
					id: this.id,
					productName: this.query.productName,
					callback: res => {
						this.paramIdx = 0
						if (this.deviceNameParamList.length > 0) this.query.parameterName = this.deviceNameParamList[0]
					}
				})
			},
			changeParam(e) {
				this.paramIdx = e.detail.value
				this.query.parameterName = this.deviceNameParamList[this.paramIdx]
			},
			initLine() {
				this.qiunData = JSON.parse(JSON.stringify({
					categories: this.xAxis,
					series: this.yAxis
				}));
			},
			switchChange(e) {
				console.log('switch2 发生 change 事件，携带值为', e.target.value)
				this.realTimeUpdateFlag = e.target.value
			},
		}
	}
</script>

<style scoped lang="less">
	.device-charts-page {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;

		.head {
			height: 218rpx;
			background: linear-gradient(180deg, #0086FF 0%, #B5DCFF 100%);
			padding: 60rpx 20rpx 0 20rpx;
			box-sizing: border-box;

			.head-box {
				width: 710rpx;
				margin: 0 auto;
				background: #fff;
				box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.2);
				border-radius: 8rpx;
				padding: 30rpx 0;
				box-sizing: border-box;

				.time-box {
					padding: 0 50rpx 34rpx 50rpx;
					border-bottom: 1px solid #eee;

					.time-text {
						display: flex;
						justify-content: space-between;
						margin-bottom: 24rpx;
						width: 100%;
						box-sizing: border-box;
						font-size: 28rpx;
						color: #999;
					}

					.time-picker {
						display: flex;
						justify-content: space-between;

						.picker {
							display: inline-block;
							vertical-align: middle;

							.time {
								font-size: 28rpx;
								color: #333;
								font-weight: bold;
							}
						}

						image {
							width: 48rpx;
							height: 48rpx;
						}
					}
				}

				.picker-list {
					width: 100%;
					padding: 0 20rpx;
					box-sizing: border-box;

					.picker-item+.picker-item {
						border-top: 1px solid #eee;
					}

					.picker-item {
						height: 100rpx;
						line-height: 100rpx;
						padding: 0 30rpx;

						.text {
							font-size: 28rpx;
							color: #999;
							width: 120rpx;
						}

						.picker {
							width: calc(~"100% - 120rpx");
							height: 100rpx;
							padding-left: 20rpx;
							box-sizing: border-box;
							position: relative;

							.item-text {
								font-size: 28rpx;
								color: #333;
								font-weight: 500;
							}

							&:after {
								content: '';
								display: inline-block;
								vertical-align: middle;
								width: 32rpx;
								height: 32rpx;
								background: url('../../static/images/icon/right.png') no-repeat;
								background-size: 100% 100%;
								position: absolute;
								right: 0;
								top: 50%;
								transform: translate(-50%, -50%; );
							}
						}
					}
				}

				.chart-btn {
					padding: 20rpx 40rpx;
					display: flex;

					.btn {
						flex: 1;
						display: inline-block;
						vertical-align: top;
						font-size: 28rpx;
						background: #f8f3fe;
						color: #0086FF;
						border: 1px solid #0086FF;
						padding: 10rpx;
						text-align: center;
						border-radius: 8rpx;
					}

					.active-btn {
						background: #0086FF;
						color: #fff;
					}

					.btn+.btn {
						margin-left: 20rpx;
					}
				}

				.submit-btn {
					width: 670rpx;
					margin: 20rpx auto 0;
					height: 98rpx;
					background: #0086FF;
					border-radius: 8rpx;
					font-size: 36rpx;
					color: #fff;
					text-align: center;
					line-height: 98rpx;
				}
			}
		}

		.charts-box {
			margin-top: 824rpx;
			padding: 20rpx;
			width: 100%;
			//overflow-x: auto;
			box-sizing: border-box;

			.charts-text {
				margin-bottom: 20rpx;

				view {
					font-size: 24rpx;
					color: #333;
					margin-bottom: 10rpx;
				}
			}
		}

		.charts {
			width: 100%;
			height: 378px;
		}
	}
</style>