<template>
  <view class="service-detail-page">
    <view class="item-content">
      <view class="item">
        <view class="left-item middle-block">服务类型</view>
        <view class="right-item middle-block">{{$tools.metadata.getText('orderType', orderDetail.type)}}</view>
      </view>
      <view class="item">
        <view class="left-item middle-block">联系电话</view>
        <view class="right-item middle-block">{{orderDetail.tel}}</view>
      </view>
      <view class="item">
        <view class="left-item middle-block">联系时间</view>
        <view class="right-item middle-block">{{orderDetail.contactTime}}</view>
      </view>
    </view>
    <view class="item-content">
      <view class="title">故障描述</view>
      <view class="text-area">
        <view class="content">{{orderDetail.errorContent}}</view>
        <view class="img">
          <image v-if="orderDetail.state === 1" src="/static/images/icon/dcl.png"></image>
          <image v-else-if="orderDetail.state === 2" src="/static/images/icon/ywc.png"></image>
          <image v-if="orderDetail.state === 3" src="/static/images/icon/yqx.png"></image>
        </view>
      </view>
    </view>
    <view class="service-btn" @click="open">申报确认</view>
    <popup :open="visible" position="bottom" class="bottom-popup" @close="visible = false">
      <view class="popup-tabbar">
        <view class="popup-close" @click="visible = false">取消</view>
        <view class="popup-confirm" @click="confirm">确定</view>
      </view>
      <view class="radio-content">
        <radio-group class="radio-group" v-model="state" @change="state = $event.detail.value">
          <label class="label" v-for="(item, i) in stateList" :key="i" >
            <radio :value="item.value" :checked="state + '' === item.value"/>{{item.label}}
          </label>
        </radio-group>
      </view>
    </popup>
  </view>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import popup from '@/components/YYT-popup/YYT-popup.vue'

  export default {
    components: {popup},
    data () {
      return {
        id: '',
        stateList: this.$tools.metadata.orderState,
        visible: false,
        state: null
      }
    },
    computed: {
      ...mapGetters([
        'orderDetail',
      ])
    },
    onLoad(option) {
      this.id = option.id
      this.loadOrderById({id: this.id})
    },
    methods: {
      ...mapActions([
        'loadOrderById',
        'changeOrderState',
      ]),
      open() {
        this.state = this.orderDetail.state
        this.visible = true
      },
      confirm() {
        let data = this.$tools.clone(this.orderDetail)
        data.state = this.state
        data.callback = res => {
          uni.showToast({title: res.msg, icon: 'success'})
          this.visible = false
          this.state = null
          this.loadOrderById({id: this.id})
        }
        this.changeOrderState(data)
      },
    }
  }
</script>

<style scoped lang="less">
  .service-detail-page {
    width: 100%;
    height: 100vh;
    padding: 20rpx 0;
    box-sizing: border-box;
    overflow-y: auto;
    background: #F8F9FB;
    .item-content + .item-content {
      margin-top: 20rpx;
    }
    .item {
      background: #fff;
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
      .middle-block {
        width: 50%;
        font-size: 28rpx;
        font-weight: 500;
      }
      .left-item {
        color: #333;
      }
      .right-item {
        color: #999;
        text-align: right;
      }
    }
    .item-content {
      .title {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        background: #fff;
        border-bottom: 1px solid #B4C3DA;
      }
      .text-area {
        width: 100%;
        padding: 20rpx;
        box-sizing: border-box;
        background: #fff;
        position: relative;
        .content {
          background: #F8F9FB;
          width: 100%;
          padding: 20rpx;
          box-sizing: border-box;
          font-size: 32rpx;
          color: #999;
          font-weight: 500;
        }
        .img {
          position: absolute;
          top: 88rpx;
          right: 20rpx;
          image {
            width: 218rpx;
            height: 218rpx;
            z-index: 100;
          }
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
    .bottom-popup {
      .popup-tabbar {
        height: 80rpx;
        line-height: 80rpx;
        border-bottom: 1px solid #efefef;
        .popup-close, .popup-confirm {
          display: inline-block;
          vertical-align: middle;
          font-size: 28rpx;
          color: #0A98D5;
          width: 50%;
          padding: 0 20rpx;
          box-sizing: border-box;
        }
        .popup-close {
          text-align: left;
        }
        .popup-confirm {
          text-align: right;
        }
      }
      .radio-content {
        width: 100%;
        padding: 40rpx;
        box-sizing: border-box;
        .radio-group {
          .label {
            display: block;
            font-size: 32rpx;
            color: #333;
            text-align: center;
          }
          .label + .label {
            margin-top: 15rpx;
          }
        }
      }
    }
  }
</style>