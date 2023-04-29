<script>
  import {mapActions, mapMutations} from 'vuex'

  export default {
    onLaunch() {
      if (uni.getStorageSync('userInfo')) this.$tools.userInfo = uni.getStorageSync('userInfo')
      if (uni.getStorageSync('metadata')) this.$tools['metadata'] = Object.assign(this.$tools['metadata'], uni.getStorageSync('metadata'))

      // #ifdef APP-PLUS
      // 锁定屏幕方向
      plus.screen.lockOrientation('landscape-primary'); //锁定
      plus.navigator.setFullscreen(true);//隐藏状态栏(应用全屏:只能隐藏状态栏，标题栏和虚拟返回键都还可以显示)
      // 检测升级
      // uni.request({
      //   url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
      //   data: {
      //     appid: plus.runtime.appid,
      //     version: plus.runtime.version,
      //     imei: plus.device.imei
      //   },
      //   success: (res) => {
      //     if (res.statusCode === 200 && res.data.isUpdate) {
      //       let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
      //       // 提醒用户更新
      //       uni.showModal({
      //         title: '更新提示',
      //         content: res.data.note ? res.data.note : '是否选择更新',
      //         success: (showResult) => {
      //           if (showResult.confirm) {
      //             plus.runtime.openURL(openUrl);
      //           }
      //         }
      //       })
      //     }
      //   }
      // })
      // #endif

      // #ifdef H5
      // 替换一下url防止安卓返回首页刷新
      const state = {
        title: "",
        url: "#"
      }
      window.history.replaceState(state, "", "#")
      // #endif
    },
    onShow() {
      // console.log('App Show')
    },
    onHide() {
      // console.log('App Hide')
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'getInfo'
      ]),
    }
  }
</script>

<style lang="less">
  @import './plugins/uni.css';

  uni-page {
    height: 100vh;
    overflow: hidden;
  }

  uni-page-body {
    height: 100%;
    overflow: hidden;
  }

  /*每个页面公共css */
  html,
  body {
    font-size: 0;
  }

  * {
    box-sizing: border-box;
  }

  *::-webkit-scrollbar {
    display: none;
  }

  .uni-toast {
    font-size: .24rem;
    color: #3B4859;
  }

  /* 原生组件模式下需要注意组件外部样式 */
  .uni-label-pointer {
    padding-right: .2rem;
  }

  /* 一行省略 */
  .one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 两行省略 */
  .two-line {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* 三行省略 */
  .three-line {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  /* 强制不换行 */
  .no-wrap {
    white-space: nowrap;
  }

  /*  按钮  */
  .submit-box {
    padding: 40rpx 0;
    box-sizing: border-box;
    .submit-btn {
      width: 700rpx;
      margin: 0 auto;
      line-height: 98rpx;
      text-align: center;
      background-color: #0086FF;
      border-radius: 8rpx;
      color: #fff;
      font-size: 36rpx;
    }
  }

  .inline-block {
    display: inline-block;
    vertical-align: top;
  }

  .middle-block {
    display: inline-block;
    vertical-align: middle;
  }


  .nothing {
    font-size: 32rpx;
    text-align: center;
    color: #788EA7;
    font-weight: bold;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
  }
  .bg {
    width: 100%;
    height: 20rpx;
    background: #F8F9FB;
  }

  .form-item {
    background: #fff;
    width: 100%;
    padding: 30rpx 40rpx;
    box-sizing: border-box;
    .left-content, .right-content {
      width: 50%;
      box-sizing: border-box;
      display: inline-block;
      vertical-align: middle;
    }
    .left-content {
      .text {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .right-content {
      font-size: 28rpx;
      text-align: right;
      .input {
        font-size: 28rpx;
        color: #999;
        font-weight: 500;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
      }
      .picker {
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        .text {
          font-size: 28rpx;
          color: #999;
          font-weight: 500;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .img {
        width: 60rpx;
        height: 60rpx;
        display: inline-block;
        vertical-align: middle;
        border-radius: 50%;
      }
    }
    .right-content.is-link {
      .input {
        padding-right: 20rpx;
        width: calc(~"100% - 40rpx");
      }
      .picker {
        padding-right: 20rpx;
      }
      .img {
      }
      &:after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 32rpx;
        height: 32rpx;
        background: url('./static/images/icon/right.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
</style>
