<template>
	<view class="device-detail-page">
		<view class="head">
			<view class="head-content">
				<view class="top">
					<view class="img inline-block">
						<image :src="deviceDetail.photo"></image>
					</view>
					<view class="detail inline-block">
						<view class="title one-line">{{deviceDetail.name}}</view>
						<view class="code one-line">{{deviceDetail.serialNumber}}</view>
					</view>
				</view>
				<!--<view class="middle">
          <view class="item">
            <view class="num danger">33.33℃</view>
            <view class="text">传感器温度</view>
          </view>
          <view class="item">
            <view class="num">36.66℃</view>
            <view class="text">散热器温度</view>
          </view>
          <view class="item">
            <view class="num">33.33℃</view>
            <view class="text">系统温度</view>
          </view>
        </view>-->
				<view class="bottom">
					<view class="item" :class="deviceDetail.state === 0 ? 'primary' : 'warning'">
						设备状态{{$tools.metadata.getText('deviceState', deviceDetail.state)}}</view>
					<view class="item" :class="onlineState === 1 ? 'offline' : 'primary'">
						{{$tools.metadata.getText('onlineState', deviceDetail.onlineState)}}
					</view>
				</view>
			</view>
		</view>
		<view class="charts" @click="toPage('/pages/device/charts?id=' + deviceDetail.id)">
			<view class="text middle-block">图表</view>
			<image class="img middle-block" src="/static/images/icon/charts.png"></image>
			<view class="detail-text middle-block">设备实时趋势图</view>
			<image class="arrow middle-block" src="/static/images/icon/right.png"></image>
		</view>
		<view class="bg"></view>
		<view class="tab-content">
			<view class="tabbar">
				<view class="item middle-block" @click="changeTab(1)" :class="{'active-item': activeIdx === 1}">检测参数</view>
				<view class="item middle-block" @click="changeTab(2)" :class="{'active-item': activeIdx === 2}">状态信息</view>

			</view>
			<view v-if="activeIdx === 2">
				<view class="tab-item">
					<view class="left-item middle-block">状态</view>
					<view class="right-item middle-block">{{$tools.metadata.getText('deviceState', deviceDetail.state)}}</view>
				</view>
			</view>
			<view v-else>
				<view class="tab-item" v-for="(item, i) in paramList" :key="i">
					<view class="left-item middle-block">{{item.parameterName}}</view>
					<view class="right-item middle-block"
						:class="{'red-color': isOverMaxY(item.value), 'blue-color': isLowMinY(item.value) }">{{item.value}}
					</view>
				</view>
			</view>
		</view>
		<view v-if="false" class="service-btn" @click="toPage('/pages/service/service')">服务申报</view>
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
				activeIdx: 1,
				paramList: [],
				timer: null,
				yMin: undefined,
				yMax: undefined
			}
		},
		computed: {
			...mapGetters([
				'deviceDetail',
			])
		},
		onLoad(option) {
			this.id = option.id
			this.loadDetail()
			this.loadParams()
			this.timer = setInterval(() => {
				this.loadParams()
			}, 10000)
		},
		onShow() {
			this.loadConfigInfoFromStorage()
		},
		onHide() {
			if (this.timer) {
				clearInterval(this.timer)
			}
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer)
			}
		},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer)
			}
		},
		onReady() {},
		methods: {
			...mapActions([
				'loadDeviceById',
				'loadDeviceParam',
			]),
			isValidY(y) {
				return y || y === 0
			},
			isOverMaxY(val) {
				if (this.isValidY(this.yMax)) {
					return Number(val) > Number(this.yMax)
				}
			},
			isLowMinY(val) {
				if (this.isValidY(this.yMin)) {
					return Number(val) < Number(this.yMin)
				}
			},
			loadConfigInfoFromStorage() {
				try {
					const value = uni.getStorageSync('device-query-params');
					if (value) {
						const data = JSON.parse(value)
						this.yMin = data.yMin
						this.yMax = data.yMax
					}
				} catch (e) {
					// error
				}
			},
			loadDetail() {
				this.loadDeviceById({
					id: this.id
				})
			},
			loadParams() {
				this.loadDeviceParam({
					id: this.id,
					callback: res => {
						if (res.data.content.length > 0) res.data.content.forEach(e => {
							e.value = e.resultValue.toFixed(e.decimalDigits)
						})
						this.paramList = res.data.content
					}
				})
			},
			changeTab(i) {
				this.activeIdx = i
			},
			toPage(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.device-detail-page {
		.head {
			width: 100%;
			height: 218rpx;
			padding: 60rpx 20rpx 0 20rpx;
			box-sizing: border-box;
			position: relative;
			background: linear-gradient(180deg, rgba(0, 134, 255, 1) 0%, rgba(181, 220, 255, 1) 100%);

			.head-content {
				width: 710rpx;
				padding: 20rpx 40rpx;
				box-sizing: border-box;
				background: #fff;
				margin: 0 auto;
				border-radius: 8rpx;
				box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.2);

				.top {
					width: 100%;

					.img {
						width: 70rpx;
						height: 70rpx;
						margin-right: 20rpx;

						image {
							width: 70rpx;
							height: 70rpx;
							border-radius: 4rpx;
							margin-top: 15rpx;
						}
					}

					.detail {
						width: calc(~"100% - 90rpx");

						.title {
							width: 100%;
							font-size: 40rpx;
							color: #333;
							font-weight: 500;
						}

						.code {
							font-size: 28rpx;
							color: #999;
							font-weight: 500;
						}
					}
				}

				.middle {
					display: flex;
					justify-content: space-between;
					width: 100%;
					padding: 25rpx 0;

					.item {
						.num {
							font-size: 48rpx;
							color: #333;
							font-weight: bold;
						}

						.num.danger {
							color: #FF0000;
						}

						.text {
							font-size: 22rpx;
							color: #999;
						}
					}
				}

				.bottom {
					margin-top: 30rpx;

					.item+.item {
						margin-left: 10rpx;
					}

					.item {
						display: inline-block;
						vertical-align: top;
						padding: 3rpx 10rpx;
						font-size: 22rpx;
					}

					.primary {
						background: #E9F4FF;
						color: #0086FF;
					}

					.offline {
						background: #F8F9FB;
						color: #999;
					}
				}
			}
		}

		.charts {
			width: 100%;
			padding: 0 60rpx;
			line-height: 80rpx;
			margin-top: 50rpx;
			box-sizing: border-box;

			.text {
				font-size: 28rpx;
				color: #999;
				font-weight: 500;
				margin-right: 15rpx;
			}

			.img {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}

			.detail-text {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				margin-right: 10rpx;
			}

			.arrow {
				width: 24rpx;
				height: 24rpx;
			}
		}

		.tab-content {
			width: 100%;
			background: #fff;

			.tabbar {
				width: 100%;
				padding: 0 20rpx;
				box-sizing: border-box;
				height: 100rpx;
				line-height: 100rpx;

				.item {
					font-size: 28rpx;
					color: #999;
					font-weight: 500;
				}

				.item+.item {
					margin-left: 40rpx;
				}

				.active-item {
					font-size: 36rpx;
					color: #333;
					position: relative;

					&:after {
						content: '';
						display: inline-block;
						position: absolute;
						left: 50rpx;
						bottom: 20rpx;
						width: 40rpx;
						height: 4rpx;
						background: #0086FF;
						border-radius: 2rpx;
					}
				}
			}

			.tab-item {
				width: 100%;
				padding: 0 40rpx;
				box-sizing: border-box;
				height: 100rpx;
				line-height: 100rpx;

				.left-item,
				.right-item {
					width: 50%;
				}

				.left-item {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}

				.right-item {
					font-size: 28rpx;
					color: #999;
					font-weight: 500;
					text-align: right;
				}
			}
		}

		.service-btn {
			position: fixed;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			font-size: 36rpx;
			bottom: 40rpx;
			left: 175rpx;
			z-index: 100;
			background: #0086FF;
			border-radius: 40rpx;
		}
	}

	.red-color {
		color: #FF0000 !important;
	}

	.blue-color {
		color: #0000FF !important;
	}
</style>