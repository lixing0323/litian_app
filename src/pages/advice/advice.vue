<template>
  <view class="advice-page">
    <view class="text-area">
      <textarea v-model="model.content" placeholder="请输入您遇到的问题或意见，我们将尽力为您解决！"></textarea>
    </view>
    <view class="input">
      <input type="text" v-model="model.contact" placeholder="请留下您的联系方式(QQ、微信、手机号)">
    </view>
    <view class="upload">
      <view class="photo inline-block" v-for="(item, i) in model.photoList">
        <icon class="del" type="cancel" @click="delPhoto(i)"></icon>
        <image class="inline-block" :src="item" :key="i"></image>
      </view>
      <view class="upload-btn inline-block" @click="upload">
        <image src="/static/images/icon/camera.png"></image>
        <view class="text">添加图片</view>
        <view class="tips">(选填)</view>
      </view>
    </view>
    <view class="submit-box">
      <view class="submit-btn" @click="submit">提交</view>
    </view>
  </view>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    data () {
      return {
        model: {
          content: '',
          contact: '',
          photoList: []
        }
      }
    },
    methods: {
      ...mapActions([
        'saveAdvice'
      ]),
      upload() {
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
                    this.model.photoList.unshift(JSON.parse(res.data).data.url)
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
      delPhoto(i) {
        this.model.photoList.splice(i, 1)
      },
      submit() {
        let data = this.$tools.clone(this.model)
        data.callback  = res => {
          uni.showToast({title: res.msg, icon: 'success'})
        }
        this.saveAdvice(data)
      }
    }
  }
</script>

<style scoped lang="less">
  .advice-page {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    background: #F8F9FB;
    padding: 20rpx 20rpx 180rpx 20rpx;
    .text-area {
      width: 100%;
      margin-bottom: 20rpx;
      box-sizing: border-box;
      textarea {
        box-sizing: border-box;
        background: #fff;
        width: 100%;
        height: 380rpx;
        padding: 20rpx;
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
      }
      .textarea-placeholder {
        color: #999;
      }
    }
    .input {
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 20rpx;
      input {
        box-sizing: border-box;
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        background: #fff;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
      .input-placeholder {
        color: #999;
      }
    }
    .upload {
      .photo {
        position: relative;
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 20rpx;
        margin-right: 20rpx;
        .del {
          top: 0;
          right: 0;
          position: absolute;
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          border-radius: 50%;
          z-index: 10;
          background-color: #fff;
          color: #F56C6C;
          font-size: 34rpx;
          font-weight: bold;
        }
        image {
          width: 200rpx;
          height: 200rpx;
        }
      }
      .upload-btn {
        box-sizing: border-box;
        width: 200rpx;
        height: 200rpx;
        padding: 20rpx 0;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        image {
          width: 64rpx;
          height: 56rpx;
        }
        .text {
          font-size: 32rpx;
          color: #333;
          font-weight: 500;
        }
        .tips {
          font-size: 28rpx;
          color: #999;
        }
      }
    }
    .submit-box {
      position: fixed;
      bottom: 0;
      left: 25rpx;
    }
  }
</style>