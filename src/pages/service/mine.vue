<template>
  <view class="my-service-page">
    <view v-if="orderList.length > 0">
      <view class="service-item" v-for="(item, i) in orderList" :key="i" @click="toPage(item)">
        <view class="title">
          <image class="middle-block" v-if="item.type === 1" src="/static/images/icon/maintain.png"></image>
          <image class="middle-block" v-else-if="item.type === 2" src="/static/images/icon/service.png"></image>
          <text v-if="item.type === 1" class="text middle-block">保养</text>
          <text v-else-if="item.type === 2" class="text middle-block">维修</text>
          <text class="state waiting" v-if="item.state === 1">待处理</text>
          <text class="state" v-else-if="item.state === 2">已完成</text>
          <text class="state cancel" v-else-if="item.state === 3">已取消</text>
        </view>
        <view class="time">联系时间：{{item.contactTime}}</view>
        <view class="desc two-line">故障描述：{{item.errorContent}}</view>
      </view>
    </view>
    <view class="nothing" v-else>暂无数据</view>
  </view>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'orderList'
      ])
    },
    onLoad() {
      this.loadOrderList({})
    },
    methods: {
      ...mapMutations([
        'setOrderDetail'
      ]),
      ...mapActions([
        'loadOrderList'
      ]),
      toPage(item) {
        this.setOrderDetail({})
        uni.navigateTo({
          url: '/pages/service/detail?id=' + item.id
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .my-service-page {
    width: 100%;
    height: 100vh;
    padding: 20rpx 0;
    box-sizing: border-box;
    overflow-y: auto;
    background: #F8F9FB;
    .service-item {
      width: 100%;
      padding: 0 40rpx 20rpx 40rpx;
      box-sizing: border-box;
      background: #fff;
      .title {
        width: 100%;
        height: 82rpx;
        line-height: 82rpx;
        border-bottom: 1px solid #E0E0E0;
        image {
          width: 30rpx;
          height: 30rpx;
          margin-right: 20rpx;
        }
        .text {
          font-size: 30rpx;
          color: #333;
          font-weight: 500;
        }
        .state {
          float: right;
          font-size: 30rpx;
          color: #0086FF;
        }
        .state.waiting {
          color: #FF0000;
        }
        .state.cancel {
          color: #999;
        }
      }
      .time {
        font-size: 28rpx;
        color: #999;
        font-weight: 500;
        margin-top: 18rpx;
      }
      .desc {
        font-size: 28rpx;
        color: #999;
        font-weight: 500;
        margin-top: 25rpx;
        line-height: 40rpx;
        max-height: 80rpx;
      }
    }
    .service-item + .service-item {
      margin-top: 20rpx;
    }
  }
</style>