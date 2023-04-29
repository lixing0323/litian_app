<template>
  <!--首页-->
  <view class="index-page">
    <view class="head">
      <view class="search">
        <input type="text" class="input" placeholder="输入搜索内容" v-model="query.search" @confirm="search">
      </view>
      <view class="head-line">
        <view class="head-item">
          <view class="num">{{totalNum}}</view>
          <view class="text">设备总数</view>
        </view>
        <view class="head-item">
          <view class="num">{{errorNum}}</view>
          <view class="text">异常设备</view>
        </view>
        <view class="head-item">
          <view class="num">{{normalNum}}</view>
          <view class="text">正常设备</view>
        </view>
      </view>
    </view>
    <scroll-view scroll-y class="scroll" @scrolltolower="loadList">
      <view class="scroll-title">全部设备</view>
      <view class="scroll-content" v-if="page.content.length > 0">
        <view class="scroll-item" v-for="(item, i) in page.content" :key="i" @click="toPage(item)">
          <view class="img">
            <image :src="item.photo"></image>
          </view>
          <view class="detail inline-block">
            <view class="title one-line">{{item.name}}</view>
            <view class="code one-line">{{item.serialNumber}}</view>
          </view>
          <view class="state inline-block">
            <view class="state-text" :class="{'abnormal': item.state !== 0}">{{$tools.metadata.getText('deviceState', item.state)}}</view>
            <view class="online-state" :class="{'offline': item.onlineState === 1}">{{$tools.metadata.getText('onlineState', item.onlineState)}}</view>
          </view>
        </view>
      </view>
      <view class="scroll-content" v-else>
        <view class="nothing">暂无设备</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      token: '',
      query: {
        search: ''
      },
      totalNum: 0,
      errorNum: 0,
      normalNum: 0,
      page: {
        size: 15,
        number: 0,
        content: []
      },
    }
  },
  computed: {
    ...mapGetters([
      'accessToken'
    ]),
  },
  onPullDownRefresh() {
    if (this.token) {
      this.init(() => {
        uni.stopPullDownRefresh()
      })
    }
  },
  onLoad() {

  },
  onShow() {
    this.token = uni.getStorageSync('accessToken')
    if (this.token) {
      this.init()
    } else {
      this.totalNum = 0
      this.errorNum = 0
      this.normalNum = 0
      this.query = {
        search: ''
      }
      this.page = {
        size: 15,
        number: 1,
        content: []
      }
    }
  },
  methods: {
    ...mapMutations([
      'setDeviceDetail',
      'setDeviceParamList',
    ]),
    ...mapActions([
      'loadDeviceList',
      'loadDeviceTotalNum',
      'loadDeviceErrorNum',
    ]),
    init(callback) {
      this.search()
      this.loadDeviceTotalNum({
        callback: res => {
          this.totalNum = res.data
          this.loadDeviceErrorNum({
            callback: res => {
              this.errorNum = res.data
              this.normalNum = this.totalNum - this.errorNum
            }
          })
        }
      })
      if (callback) callback()
    },
    search() {
      if (!this.token) return
      this.page.number = 0
      this.loadList()
    },
    loadList() {
      if (this.page.number > this.page.totalPages) return
      this.loadDeviceList({
        pageSize: this.page.size,
        pageNo: this.page.number + 1,
        search: this.query.search,
        callback: res => {
          if (this.page.number === 0) this.page = res.data
          else this.page.content = this.page.content.concat(res.data.content)
          this.page.number++
        }
      })
    },
    toPage(item) {
      this.setDeviceDetail({})
      this.setDeviceParamList({})
      uni.navigateTo({
        url: '/pages/device/detail?id=' + item.id
      })
    }
  }
}
</script>

<style lang="less">
.index-page {
  width: 100%;
  height: 100vh;
  .head {
    background: #0086FF;
    height: 282rpx;
    .search {
      width: 100%;
      box-sizing: border-box;
      padding: 20rpx;
      .input {
        width: 100%;
        height: 72rpx;
        line-height: 72rpx;
        border-radius: 36rpx;
        box-sizing: border-box;
        background: #fff;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
        /*&:before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 34rpx;
          height: 34rpx;
          background: url('../../static/images/icon/search.png') no-repeat;
          background-size: 100% 100%;
        }*/
      }
      .input-placeholder {
        color: #999;
      }
    }
    .head-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 20rpx 40rpx 40rpx 40rpx;
      box-sizing: border-box;
      .head-item {
        text-align: center;
        .num {
          font-size: 48rpx;
          font-weight: bold;
          color: #fff;
        }
        .text {
          font-size: 24rpx;
          color: #fff;
          font-weight: 500;
          margin-top: 10rpx;
        }
      }
    }
  }
  .scroll {
    background: #F8F9FB;
    width: 100%;
    height: calc(~"100% - 282rpx");
    box-sizing: border-box;
    padding: 20rpx 0;
    overflow-y: auto;
    .scroll-title {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
      width: 100%;
      padding: 20rpx;
      box-sizing: border-box;
    }
    .scroll-content {

      .scroll-item {
        margin-top: 62rpx;
        width: 100%;
        height: 178rpx;
        background: #fff;
        position: relative;
        padding: 20rpx;
        box-sizing: border-box;
        .img {
          width: 200rpx;
          height: 200rpx;
          background: #ddd;
          position: absolute;
          bottom: 20rpx;
          left: 20rpx;
          border-radius: 8rpx;
          image {
            border-radius: 8rpx;
            width: 200rpx;
            height: 200rpx;
          }
        }
        .detail {
          margin-left: 220rpx;
          width: calc(~"100% - 310rpx");
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
            margin-top: 20rpx;
          }
        }
        .state {
          width: 90rpx;
          text-align: right;
          padding: 30rpx 0;
          box-sizing: border-box;
          .state-text {
            font-size: 28rpx;
            font-weight: 500;
            color: #0086FF;
          }
          .state-text.abnormal {
            color: #FF0000;
          }
          .online-state {
            margin-left: 20rpx;
            font-size: 28rpx;
            font-weight: 500;
            color: #0086FF;
          }
          .offline {
            color: #999;
          }
        }
      }
    }
  }
}
</style>
