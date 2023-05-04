<template>
  <view class="service-page">
    <view class="title">服务类型</view>
    <view class="select-item">
      <view class="item inline-block"
            v-for="(item, i) in typeList"
            :key="i"
            :class="{'active-item': activeIdx === i}" @click="changeActive(i)">
        <image v-if="activeIdx === i" class="inline-block" src="/static/images/icon/mark.png"></image>
        <text class="inline-block">{{item.label}}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="left-content">
        <text class="text">联系电话</text>
      </view>
      <view class="right-content">
        <input type="text" placeholder="联系电话" class="input" v-model="model.tel">
      </view>
    </view>
    <view class="form-item">
      <view class="left-content">
        <text class="text">联系时间</text>
      </view>
      <view class="right-content is-link">
        <picker class="picker" mode="date" value="model.date" @change="model.contactTime = $event.detail.value">
          <view class="text">{{model.contactTime}}</view>
        </picker>
      </view>
    </view>
    <view class="form-item">
      <view class="left-content">
        <text class="text">是否需要远程控制</text>
      </view>
      <view class="right-content is-link">
        <picker class="picker" :range="boolList" range-key="label" :value="controlIdx" @change="changeControl">
          <view class="text">{{boolList[controlIdx].label}}</view>
        </picker>
      </view>
    </view>
    <view class="bg"></view>
    <view class="title">故障描述</view>
    <view class="text-area">
      <textarea v-model="model.errorContent" placeholder="请输入故障描述"></textarea>
    </view>
    <view class="submit-box">
      <view class="submit-btn" @click="submit">提交</view>
    </view>
  </view>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data () {
      return {
        activeIdx: 0,
        typeList: this.$tools.metadata.orderType,
        controlIdx: 0,
        boolList: this.$tools.metadata.booleanType,
        model: {
          type: '',
          tel: '',
          contactTime: this.$tools.formatDate(new Date(), 'yyyy-MM-dd'),
          errorContent: '',
          isControl: 0,
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    onLoad() {
      console.log(this.$tools.metadata)
    },
    methods: {
      ...mapActions([
        'saveOrder'
      ]),
      changeActive(i) {
        this.activeIdx = i
        this.model.type = this.typeList[i].value
      },
      changeControl(e) {
        this.controlIdx = e.detail.value
        this.model.isControl = this.boolList[this.controlIdx].value
      },
      submit() {
        let data = this.$tools.clone(this.model)
        data.userId = this.userInfo.userId
        data.username = this.userInfo.username
        data.companyId = this.userInfo.companyId
        data.type = this.typeList[this.activeIdx].value
        data.isControl = this.boolList[this.controlIdx].value
        data.callback = res => {
          uni.showToast({title: res.msg, icon: 'success'})
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        }
        this.saveOrder(data)
      }
    }
  }
</script>

<style scoped lang="less">
  .service-page {
    width: 100%;
    height: 100vh;
    background: #F8F9FB;
    padding-top: 20rpx;
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
      border-bottom: 1px solid #EEEDF0;
    }
    .select-item {
      background: #fff;
      width: 100%;
      padding: 20rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #EEEDF0;
      .item + .item {
        margin-left: 20rpx;
      }
      .item {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        padding: 20rpx 100rpx;
        border: 1px solid #D6D6D6;
        border-radius: 8rpx;
        position: relative;
        image {
          width: 46rpx;
          height: 48rpx;
          position: absolute;
          bottom: 0;
          right: -1rpx;
        }
      }
      .active-item {
        border-color: #0086FF;
        background: #F4FAFF;
      }
    }
    .text-area {
      width: 100%;
      padding: 20rpx;
      box-sizing: border-box;
      background: #fff;
      textarea {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        width: 100%;
        height: 140rpx;
        padding: 20rpx;
        box-sizing: border-box;
        background: #F8F9FB;
      }
      .textarea-placeholder {
        color: #999;
      }
    }
  }
</style>