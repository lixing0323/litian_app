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
						<picker class="picker" :disabled="disabledTime" mode="date" :value="query.startDate"
							@change="changeStartDate">
							<view class="time" :class="{'self-color': isSelfTime()}">{{query.startDate}}</view>
						</picker>
						<picker class="picker" :disabled="disabledTime" mode="time" :value="query.startTime"
							@change="changeStartTime">
							<view class="time" :class="{'self-color': isSelfTime()}">{{query.startTime}}</view>
						</picker>
						<image src="/static/images/icon/dash.png"></image>
						<picker class="picker" :disabled="disabledTime || realTimeUpdateFlag" mode="date" :value="query.endDate"
							@change="changeEndDate">
							<view class="time" :class="{'self-color': isSelfTime()&&!realTimeUpdateFlag}">{{query.endDate}}</view>
						</picker>
						<picker class="picker" :disabled="disabledTime || realTimeUpdateFlag" mode="time" :value="query.endTime"
							@change="changeEndTime">
							<view class="time" :class="{'self-color': isSelfTime()&&!realTimeUpdateFlag}">{{query.endTime}}</view>
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
					<text v-for="(bt, index) in buttons" :key="index" class="btn"
						:class="{'active-btn': selectedTimeIdx === index}" @click="changeBtn(index, bt)">{{ bt }}</text>
				</view>
				<view class="limit-list form">
					<view class="form-item">
						<view class="left-content">
							<text class="text">实时更新</text>
						</view>
						<view class="right-content">
							<switch :checked="realTimeUpdateFlag" @change="switchChangeRealTime" />
						</view>
					</view>
					<view class="form-item">
						<view class="left-content">
							<text class="text">数据全部显示</text>
						</view>
						<view class="right-content">
							<switch :checked="allShowUpdateFlag" @change="switchChangeAllShow" />
						</view>
					</view>
					<view class="form-item">
						<view class="left-content">
							<text class="text">y轴最大值</text>
						</view>
						<view class="right-content">
							<input type="number" v-model="yMax" class="input" @change="changeYMaxValue" placeholder="请输入">
						</view>
					</view>
					<view class="form-item">
						<view class="left-content">
							<text class="text">y轴最小值</text>
						</view>
						<view class="right-content">
							<input type="number" v-model="yMin" class="input" @change="changeYMinValue" placeholder="请输入">
						</view>
					</view>
				</view>
				<view class="submit-btn" @click="submit()">确定</view>
			</view>
		</view>

		<view class="charts-box" v-if="xAxis.length > 0">
			<view class="charts-text">
				<view class="item">
					<view class="left">
						<view class="label">最大值</view>
						<view class="time">{{ parseTime(statistics.maxTime, '{m}-{d} {h}:{i}:{s}') }}</view>
					</view>
					<view class="right">{{ statistics.maxVal }}</view>
				</view>
				<view class="item line">
					<view class="left">
						<view class="label">平均值</view>
					</view>
					<view class="right">{{ statistics.avgVal }}</view>
				</view>
			</view>

			<view class="charts-text">
				<view class="item">
					<view class="left">
						<view class="label">最小值</view>
						<view class="time">{{ parseTime(statistics.minTime, '{m}-{d} {h}:{i}:{s}') }}</view>
					</view>
					<view class="right">{{ statistics.minVal }}</view>
				</view>
				<view class="item line">
					<view class="left">
						<view class="label">合格率</view>
					</view>
					<view class="right">{{ statistics.rate}}%</view>
				</view>
			</view>

			<view class="charts" :style="{'height':cHeight + 'px'}">
				<qiun-data-charts ref="ucharts" :animation="false" type="line" :canvas2d="true" :opts="opts"
					:chartData="chartData" />
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
				id: '',
				yMax: '',
				yMin: '',
				statistics: {
					maxVal: 0,
					maxTime: '-',
					minVal: 0,
					minTime: '-',
					avgVal: 0,
					avgTime: '-',
					rate: 0
				},
				query: {
					startDate: '',
					startTime: '',
					endDate: '',
					endTime: '',
					productName: '',
					parameterName: '',
				},
				selectedTimeIdx: 0,
				selectedTimeName: '1小时',
				hourBts: ['1小时', '2小时', '8小时', '自定义'],
				miniteBts: ['10分钟', '30分钟', '60分钟', '自定义'],
				nameIdx: 0,
				paramIdx: 0,
				chartData: [],
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
					dataLabel: false, // 是否显示图表区域内数据点上方的数据文案
					enableMarkLine: true, // 是否启用标记线功能
					disableScroll: true, // 在图表上滑动时禁止页面滚动。开启后，触摸图表时将会禁止屏幕滚动以及下拉刷新
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
				cWidth: '',
				cHeight: '',
				realTimeUpdateFlag: false,
				allShowUpdateFlag: false,
				realTimer: '',
			}
		},
		computed: {
			...mapGetters([
				'deviceNameParamList',
				'deviceNameList',
			]),
			disabledTime() {
				return !this.isSelfTime()
			},
			buttons() {
				return this.realTimeUpdateFlag ? this.miniteBts : this.hourBts
			},
		},
		watch: {
			realTimeUpdateFlag(val) {
				if (!val) {
					if (this.realTimer) {
						clearInterval(this.realTimer)
					}
				}
			}
		},
		onLoad(option) {
			this.id = option.id
			this.init()
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.cHeight = res.screenHeight - 90 - 100
					this.cWidth = res.screenWidth - 20
				}
			})
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
			init() {
				// 从本地读取数据
				this.loadConfigInfoFromStorage()
				this.changeBtn(this.selectedTimeIdx)
				this.loadDeviceName({
					id: this.id,
					callback: res => {
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
			isSelfTime() {
				return this.selectedTimeIdx === 3
			},
			getTimeValue(timeName) {
				let val
				if (!this.isSelfTime()) {
					val = this.realTimeUpdateFlag ? this.selectedTimeName.replace(/分钟/g, '') :
						this.selectedTimeName.replace(/小时/g, '')
				}
				return Number(val)
			},
			changeBtn(index = 0, name) {
				// 设置已选中的时间
				this.selectedTimeIdx = index
				this.selectedTimeName = !name ? this.buttons[index] : name

				// 结束时间
				let now = new Date()
				this.query.endDate = this.parseTime(now, '{y}-{m}-{d}')
				this.query.endTime = this.parseTime(now, '{h}:{i}')

				// 非自定义，设置时间
				if (!this.isSelfTime()) {
					let now = new Date()
					// 实时时间以分钟为单位，否则以小时为单位
					let value = this.getTimeValue(this.selectedTimeName)
					const multiple = this.realTimeUpdateFlag ? 60000 : 3600000
					const startTime = new Date(now.getTime() - value * multiple)
					// format
					this.query.startDate = this.parseTime(startTime, '{y}-{m}-{d}')
					this.query.startTime = this.parseTime(startTime, '{h}:{i}')
				}
				this.clearChartData()
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
				// 标记线
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
				// 数据全部显示
				if (this.allShowUpdateFlag) {
					this.opts.enableScroll = false
					this.opts.xAxis.format = 'xAxisDemo3'
				} else {
					this.opts.enableScroll = true // 开启滚动条，X轴配置里需要配置itemCount单屏幕数据点数量
					this.opts.xAxis.itemCount = 10 // 可见区域数据数量
					this.opts.xAxis.labelCount = 10 //可见区域标签数量
					this.opts.xAxis.format = 'xAxisDemo4'
				}
			},
			saveConfigInfo() {
				const data = {
					startDate: this.query.startDate,
					endDate: this.query.endDate,
					startTime: this.query.startTime,
					endTime: this.query.endTime,
					productName: this.query.productName,
					parameterName: this.query.parameterName,
					yMax: this.yMax,
					yMin: this.yMin,
					selectedTimeIdx: this.selectedTimeIdx,
					selectedTimeName: this.selectedTimeName,
					allShowUpdateFlag: this.allShowUpdateFlag,
					realTimeUpdateFlag: this.realTimeUpdateFlag
				}
				uni.setStorageSync('device-query-params', JSON.stringify(data))
			},
			loadConfigInfoFromStorage() {
				try {
					const value = uni.getStorageSync('device-query-params');
					if (value) {
						const data = JSON.parse(value)
						this.query.productName = data.productName
						this.query.parameterName = data.parameterName
						this.yMin = data.yMin
						this.yMax = data.yMax
						this.selectedTimeIdx = data.selectedTimeIdx
						this.selectedTimeName = data.selectedTimeName
						this.allShowUpdateFlag = data.allShowUpdateFlag
						this.realTimeUpdateFlag = data.realTimeUpdateFlag
						if (this.isSelfTime()) {
							this.query.startDate = data.startDate
							this.query.endDate = data.endDate
							this.query.startTime = data.startTime
							this.query.endTime = data.endTime
						}
					}
				} catch (e) {
					// error
				}
			},
			submit() {
				this.loadCharts(true)
				if (this.realTimeUpdateFlag) {
					this.realTimer = setInterval(() => {
						this.changeBtn(this.selectedTimeIdx)
						this.loadCharts(false)
					}, 10000)
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
					start: this.query.startDate + ' ' + this.query.startTime + ':00',
					end: this.query.endDate + ' ' + this.query.endTime + ':00',
					productName: this.query.productName,
					parameterName: this.query.parameterName,
					loading: loading,
					callback: res => {
						this.xAxis = []
						if (res.data.content.length > 0) {
							// 统计数据
							const content = res.data.content[0]
							let result = content.result
							const decimal = content.statistics.decimalDigits
							const statistics = content.statistics
							this.statistics.maxVal = statistics.max.toFixed(decimal)
							this.statistics.minVal = statistics.min.toFixed(decimal)
							this.statistics.avgVal = statistics.avg.toFixed(decimal)
							this.statistics.rate = statistics.rate
							// 结果
							let y = []
							let index = 0
							result.forEach(e => {
								let list = e.ctime.split(' ')
								let dateList = list[0].split('-')
								let timeList = list[1].split(':')
								let date = dateList[1] + '.' + dateList[2] + ' ' + timeList[0] + ':' + timeList[1] + ':' +
									timeList[2]
								this.xAxis.push(date)
								y.push(e.value)

								// 时间值
								const currentVal = Number(e.value).toFixed(decimal)
								if (this.statistics.maxVal === currentVal) {
									this.statistics.maxTime = e.ctime
								} else if (this.statistics.minVal === currentVal) {
									this.statistics.minTime = e.ctime
								}
							})
							// 点
							this.chartData = JSON.parse(JSON.stringify({
								categories: this.xAxis,
								series: [{
									name: '',
									data: y
								}]
							}));
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
				this.clearChartData()
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
				this.clearChartData()
				this.paramIdx = e.detail.value
				this.query.parameterName = this.deviceNameParamList[this.paramIdx]
			},
			clearChartData() {
				this.xAxis = []
			},
			switchChangeRealTime(e) {
				this.realTimeUpdateFlag = e.target.value
				this.clearChartData()
			},
			switchChangeAllShow(e) {
				this.allShowUpdateFlag = e.target.value
				this.clearChartData()
			},
			changeStartDate(e) {
				this.query.startDate = e.detail.value
				this.clearChartData()
			},
			changeStartTime(e) {
				this.query.startTime = e.detail.value
				this.clearChartData()
			},
			changeEndDate(e) {
				this.query.endDate = e.detail.value
				this.clearChartData()
			},
			changeEndTime(e) {
				this.query.endTime = e.detail.value
				this.clearChartData()
			},
			changeYMaxValue(e) {
				this.clearChartData()
			},
			changeYMinValue(e) {
				this.clearChartData()
			}
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
			margin-top: 936rpx;
			padding: 20rpx;
			width: 100%;
			//overflow-x: auto;
			box-sizing: border-box;

			.charts-text {
				margin-bottom: 8rpx;
				display: flex;
				background-color: #eee;

				.line {
					border-left: 1px dashed grey;
				}

				.item {
					flex: 1;
					padding: 10rpx;
					display: flex;
					justify-items: center;
					align-items: center;

					.left {
						flex: 1;
						text-align: center;

						.label {
							font-size: 30rpx;
							font-weight: bold;
						}

						.time {
							font-size: 20rpx;
							color: #666;
						}
					}

					.right {
						flex: 1;
						font-size: 32rpx;
						text-align: center;
					}
				}
			}
		}

		.charts {
			width: 100%;
			height: 378px;
		}
	}

	.self-color {
		color: #0086FF !important;
		border: 1px solid !important;
		border-radius: 8rpx;
		padding: 0 3px !important;
	}
</style>