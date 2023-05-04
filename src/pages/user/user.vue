<template>
  <view class="user-page">
    <view class="user-top">
      <view class="top-left inline-block">
        <view class="name" v-if="token">{{userInfo.username}}</view>
        <view class="name" v-else @click="toLogin">去登录</view>
        <view class="tel inline-block" v-if="token">
          <image src="/static/images/user/tel.png" class="middle-block"></image>
          <text class="text middle-block">{{userInfo.tel}}</text>
        </view>
      </view>
      <view class="top-right inline-block">
        <image class="img" v-if="token" :src="userInfo.photo"></image>
        <image class="img" v-else src="/static/images/user/avatar.png"></image>
      </view>
    </view>
    <view class="content-box">
      <view class="item" @click="toPage('/pages/user/my')">
        <image class="icon middle-block" src="/static/images/user/zhgl.png"></image>
        <text class="text middle-block">账号管理</text>
      </view>
      <view class="item" @click="toPage('/pages/service/mine')">
        <image class="icon middle-block" src="/static/images/user/wdsb.png"></image>
        <text class="text middle-block">我的申报</text>
      </view>
      <view class="item" @click="toPage('/pages/protocol/protocol')">
        <image class="icon middle-block" src="/static/images/user/fwxy.png"></image>
        <text class="text middle-block">服务协议</text>
      </view>
      <view class="item" @click="toPage('/pages/advice/advice')">
        <image class="icon middle-block" src="/static/images/user/yjfk.png"></image>
        <text class="text middle-block">意见反馈</text>
      </view>
      <!--<view class="item">
        <image class="icon middle-block" src="/static/images/user/bqxx.png"></image>
        <text class="text middle-block">版权信息</text>
      </view>-->
      <!--<view class="item">
        <image class="icon middle-block" src="/static/images/user/setting.png"></image>
        <text class="text middle-block">设置</text>
      </view>-->
    </view>
  </view>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        token: '',
        userInfo: {},
      }
    },
    computed: {
      ...mapGetters([
        'accessToken',
      ])
    },
    onLoad() {
    },
    onShow() {
      this.token = uni.getStorageSync('accessToken')
      this.userInfo = uni.getStorageSync('userInfo')
    },
    methods: {
      toLogin() {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      },
      toPage(url) {
        if (!this.token) return uni.showModal({
          title: '系统提示',
          content: '请先登录',
        })
        uni.navigateTo({
          url
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .user-page {
    width: 100%;
    height: 100vh;
    background: #F8F9FB;
    .user-top {
      width: 100%;
      height: 462rpx;
      padding: 20rpx 40rpx;
      box-sizing: border-box;
      background: #0086FF;
      border-radius: 0 0 40rpx 40rpx;
      .top-left {
        .name {
          font-size: 44rpx;
          font-weight: 500;
          color: #fff;
        }
        .tel {
          background: rgba(255, 255, 255, .2);
          color: #fff;
          padding: 14rpx 18rpx;
          margin-top: 18rpx;
          border-radius: 30rpx;
          image {
            width: 32rpx;
            height: 32rpx;
            margin-right: 10rpx;
          }
          .text {
            font-size: 28rpx;
            color: #fff;
          }
        }
      }
      .top-right {
        float: right;
        width: 120rpx;
        height: 120rpx;
        .img {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
          margin-top: 10rpx;
        }
      }
    }
    .content-box {
      margin: -240rpx auto 0;
      background: #fff;
      padding: 20rpx;
      width: 710rpx;
      box-sizing: border-box;
      border-radius: 16rpx;
      .item {
        padding: 0 20rpx;
        height: 120rpx;
        line-height: 120rpx;
        position: relative;
        .icon {
          width: 40rpx;
          height: 40rpx;
        }
        .text {
          font-size: 34rpx;
          color: #333;
          font-weight: 500;
          margin-left: 28rpx;
        }
        &:after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(-50%, -50%);
          text-align: right;
          width: 32rpx;
          height: 32rpx;
          background: url('../../static/images/icon/right.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>