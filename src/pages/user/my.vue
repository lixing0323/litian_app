<template>
  <view class="my-page">
    <view class="form">
      <view class="form-item">
        <view class="left-content">
          <text class="text">头像</text>
        </view>
        <view class="right-content is-link" @click="uploadImg">
          <image class="img" :src="model.photo"></image>
        </view>
      </view>
      <view class="form-item">
        <view class="left-content">
          <text class="text">用户名</text>
        </view>
        <view class="right-content is-link">
          <input type="text" v-model="model.username" placeholder="用户名" class="input">
        </view>
      </view>
      <view class="form-item">
        <view class="left-content">
          <text class="text">手机号</text>
        </view>
        <view class="right-content is-link">
          <input type="text" v-model="model.tel" class="input" placeholder="手机号">
        </view>
      </view>
    </view>
    <view class="submit-box">
      <view class="logout-btn submit-btn" @click="out">退出登录</view>
      <view class="submit-btn" @click="submit">保存</view>
    </view>
  </view>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data () {
      return {
        model: {
          username: '',
          tel: ''
        },
        userInfo: {},
      }
    },
    computed: {
      ...mapGetters([
      ])
    },
    onLoad() {
      this.model = this.$tools.clone(uni.getStorageSync('userInfo'))
    },
    methods: {
      ...mapActions([
        'changeUserInfo',
        'logout'
      ]),
      uploadImg() {
        uni.chooseImage({
          count: 1,
          success: imgRes => {
            let filePath = imgRes.tempFilePaths[0]
            uni.getFileSystemManager().readFile({
              filePath: filePath,
              encoding: 'binary',
              success: readRes => {
                uni.showToast({title: '正在上传...',icon: 'loading',duration: 100000,position: 'center'})
                uni.uploadFile({
                  url: 'https://rpi.itkairui.com/api/upload/file?path=img',
                  filePath: filePath,
                  name: 'file',
                  formData: {
                    file: readRes.data
                  },
                  success: res => {
                    this.model.photo = JSON.parse(res.data).data.url
                  },
                  fail: res => {
                    console.log(res)
                  },
                  complete: () => {
                    uni.hideToast()
                  }
                })
              },
              fail: res => {
                console.log(res)
              },
              complete: () => {}
            })
          }
        })
      },
      out() {
        this.logout({
          callback: () => {
            uni.navigateBack()
          }
        })
      },
      submit() {
        let data = this.$tools.clone(this.model)
        data.callback = res => {
          uni.showToast({title: res.msg, icon: 'success'})
        }
        this.changeUserInfo(data)
      },
    }
  }
</script>

<style scoped lang="less">
  .my-page {
    background: #F8F9FB;
    width: 100%;
    height: 100vh;
    padding-top: 20rpx;
    box-sizing: border-box;
    .form-item + .form-item {
      border-top: 1px solid #EEEDF0;
    }
    .form {
      width: 100%;
      background: #fff;
      padding: 0 20rpx;
      box-sizing: border-box;
      .form-item {
        padding: 30rpx 20rpx;
      }
    }
    .submit-box{
      position: fixed;
      bottom: 0;
      left: 25rpx;
      .logout-btn {
        background-color: #ff0000;
        margin-bottom: 20rpx;
      }
    }
  }
</style>