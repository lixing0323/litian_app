<template>
  <view class="login-page">
    <view class="logo">
      <image class="img" src="/static/images/icon/logo@2x.png"></image>
      <view class="logo-text">瑞谱分析仪数据管理平台</view>
    </view>
    <view class="form">
      <view class="form-item">
        <view class="form-title">手机号</view>
        <view class="form-content">
          <input type="text" v-model="model.tel" class="input" placeholder="请输入手机号">
        </view>
      </view>
      <view class="form-item">
        <view class="form-title">验证码</view>
        <view class="form-content">
          <input type="text" v-model="model.code" class="input code-input" placeholder="请输入验证码">
          <view class="code" v-if="!button.disabled" @click.stop="getCode">{{button.content}}</view>
          <view class="code disabled-code" v-else>{{button.content}}秒</view>
        </view>
      </view>
    </view>
    <view class="submit-box">
      <view class="submit-btn" @click="submit">提交</view>
    </view>
  </view>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      model: {
        tel: '',
        code: ''
      },
      button: {
        content: '获取验证码',
        disabled: false,
        n: 60
      },
      userInfo: {},
    }
  },
  onReady() {
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions([
      'login',
      'sendCode'
    ]),
    getCode() {
      if (!this.model.tel) return uni.showToast({title: '请输入手机号', icon: 'none'})
      this.sendCode({
        tel: this.model.tel,
        callback: res => {
          this.button.content = this.button.n
          this.button.disabled = true
          let timer = setInterval(() => {
            this.button.n--
            this.button.content = this.button.n
            if (this.button.n === 0) {
              clearInterval(timer)
              timer = null
              this.button = {
                disabled: false,
                content: '获取验证码',
                n: 60
              }
            }
          }, 1000)
        }
      })
    },
    submit() {
      this.login({
        tel: this.model.tel,
        username: this.model.tel,
        code: this.model.code,
        callback: () => {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.login-page {
  width: 100%;
  .logo {
    width: 100%;
    padding: 130rpx 0 80rpx 0;
    box-sizing: border-box;
    text-align: center;
    .img {
      width: 120rpx;
      height: 107rpx;
    }
    .logo-text {
      font-size: 36rpx;
      color: #333;
      font-weight: 500;
      margin-top: 22rpx;
    }
  }
  .form {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    width: 100%;
    .form-item + .form-item {
      border-top: 1px solid #eee;
    }
    .form-item {
      width: 100%;
      line-height: 96rpx;
      padding: 0 22rpx;
      box-sizing: border-box;
      .form-title, .form-content {
        display: inline-block;
        vertical-align: middle;
      }
      .form-title {
        width: 173rpx;
        font-size: 34rpx;
        color: #333;
      }
      .form-content {
        position: relative;
        width: calc(~"100% - 173rpx");
        .input {
          font-size: 34rpx;
        }
        .input-placeholder {
          color: #ccc;
          font-size: 34rpx;
        }
        .code-input {
          width: calc(~"100% - 200rpx");
        }
        .code {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 34rpx;
          color: #0086FF;
          width: 200rpx;
          height: 48rpx;
          line-height: 48rpx;
          box-sizing: border-box;
          padding-left: 20rpx;
          border-left: 1px solid #eee;
        }
        .disabled-code {
          color: #ccc;
        }
      }
    }
  }
}
</style>
