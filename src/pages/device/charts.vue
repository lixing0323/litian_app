<template>
  <view class="device-charts-page">
    <view class="head">
      <view class="head-box">
        <view class="time-box">
          <view class="time-text">
            <text>开始时间</text>
            <text>结束时间</text>
          </view>
          <view class="time-picker">
            <picker class="picker" mode="date" :value="query.start" @change="query.start = $event.detail.value">
              <view class="time">{{query.start}}</view>
            </picker>
            <picker class="picker" mode="time" :value="query.startTime" @change="query.startTime = $event.detail.value">
              <view class="time">{{query.startTime}}</view>
            </picker>
            <image src="/static/images/icon/dash.png"></image>
            <picker class="picker" mode="date" :value="query.end" @change="query.end = $event.detail.value">
              <view class="time">{{query.end}}</view>
            </picker>
            <picker class="picker" mode="time" :value="query.endTime" @change="query.endTime = $event.detail.value">
              <view class="time">{{query.endTime}}</view>
            </picker>
          </view>
        </view>
        <view class="picker-list">
          <view class="picker-item">
            <view class="text middle-block">产品</view>
            <picker class="picker middle-block" :range="deviceNameList" :value="nameIdx" @change="changeName">
              <view class="item-text" v-if="deviceNameList.length > 0">{{deviceNameList[nameIdx]}}</view>
              <view class="item-text" v-else>暂无产品</view>
            </picker>
          </view>
          <view class="picker-item">
            <view class="text middle-block">参数</view>
            <picker class="picker middle-block" :range="deviceNameParamList" :value="paramIdx" @change="changeParam">
              <view class="item-text" v-if="deviceNameParamList.length > 0">{{deviceNameParamList[paramIdx]}}</view>
              <view class="item-text" v-else>暂无参数</view>
            </picker>
          </view>
        </view>
        <view class="chart-btn">
          <text class="btn" :class="{'active-btn': activeBtn === 1}" @click="changeBtn(1)">1h</text>
          <text class="btn" :class="{'active-btn': activeBtn === 8}" @click="changeBtn(8)">8h</text>
          <text class="btn" :class="{'active-btn': activeBtn === 12}" @click="changeBtn(12)">12h</text>
          <text class="btn" :class="{'active-btn': activeBtn === 24}" @click="changeBtn(24)">24h</text>
        </view>
        <view class="limit-list form">
          <view class="form-item">
            <view class="left-content">
              <text class="text">实时更新</text>
            </view>
            <view class="right-content">
              <switch @change="switchChange" />
            </view>
          </view>
          <view class="form-item">
            <view class="left-content">
              <text class="text">y轴最大值</text>
            </view>
            <view class="right-content">
              <input type="text" v-model="yMax" class="input" placeholder="请输入" @input="fomartYMax(yMax)">
            </view>
          </view>
          <view class="form-item">
            <view class="left-content">
              <text class="text">y轴最小值</text>
            </view>
            <view class="right-content">
              <input type="text" v-model="yMin" class="input" placeholder="请输入" @input="fomartYMin(yMin)">
            </view>
          </view>
        </view>
        <view class="submit-btn" @click="loadCharts">确定</view>
      </view>
    </view>
    <view class="charts-box" v-if="chartData.result.length > 0">

      <view class="charts-text" >
        <view>最大值：{{chartData.statistics.maxVal}}</view>
        <view>最小值：{{chartData.statistics.minVal}}</view>
        <view>平均值：{{chartData.statistics.avgVal}}</view>
        <view>合格率：{{chartData.statistics.rate}}%</view>
      </view>
      <view class="charts">
        <canvas canvas-id="lineCharts" id="lineCharts" :style="{'width':cWidth*pixelRatio + 'px','height':cHeight*pixelRatio + 'px'}" disable-scroll=true @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
      </view>
    </view>

  </view>
</template>

<script>
  import uCharts from '@/components/u-charts/u-charts.js'
  import {mapGetters, mapActions} from 'vuex'
  let _self = null;
  let canvaColumn = null;
  export default {
    data () {
      return {
        id: '',
        startTime: '',
        endTime: '',
        query: {
          start: '',
          startTime: '',
          end: '',
          endTime: '',
          productName: '',
          parameterName: '',
        },
        activeBtn: 0,
        nameIdx: 0,
        paramIdx: 0,
        chartData: {
          result: []
        },
        xAxis: [],
        yAxis: [],
        pixelRatio:1,
        cWidth:'',
        cHeight:'',
        yMax: '',
        yMin: '',
        realTimeUpdateFlag: false,
        realTimer: '',
      }
    },
    computed: {
      ...mapGetters([
        'deviceNameParamList',
        'deviceNameList',
      ])
    },
    watch: {
      realTimeUpdateFlag(val ,old){
        if(val){
          if(this.realTimer){
            clearInterval(this.realTimer)
          }
          this.realTimer = setInterval(()=>{
            this.changeBtn(1)
            this.loadCharts()
          }, 10000)
        }else{
          if(this.realTimer){
            clearInterval(this.realTimer)
          }
        }
      },
    },
    onLoad(option) {
      this.id = option.id
      this.init()
    },
    mounted() {
      uni.getSystemInfo({
        success: res => {
          // this.cHeight = (res.screenHeight * 0.9) / 2 - 40
          this.cHeight = res.screenHeight - 90 - 100
          this.cWidth = res.screenWidth - 20
        }
      })
      _self = this
      // this.getTime(24)
      this.changeBtn(1)
    },
    beforeDestroy(){
      if(this.realTimer){
        clearInterval(this.realTimer)
      }
    },
    methods: {
      ...mapActions([
        'loadDeviceChart',
        'loadDeviceName',
        'loadDeviceParamByName',
      ]),
      getTime(i) {
        let date = new Date()
        this.endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        let startTime = new Date(date.getTime() - i * 3600000)
        this.startTime = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate() + ' ' + startTime.getHours() + ':' + startTime.getMinutes() + ':' + date.getSeconds()
        let endList = this.endTime.split(' ')
        let startList = this.startTime.split(' ')
        this.query.end = endList[0]
        this.query.endTime = endList[1]
        this.query.start = startList[0]
        this.query.startTime = startList[1]
      },
      init() {
        this.loadDeviceName({
          id: this.id,
          callback: res => {
            if (this.deviceNameList.length > 0) this.query.productName = this.deviceNameList[0]
            this.loadDeviceParamByName({
              id: this.id,
              productName: this.query.productName,
              callback: res => {
                if (this.deviceNameParamList.length > 0) this.query.parameterName = this.deviceNameParamList[0]
              }
            })
          }
        })
      },
      changeBtn(i) {
        this.activeBtn = i
        this.getTime(i)
      },
      loadCharts2(){
        this.xAxis.push('aaa')
        console.log(canvaColumn)
        console.log(canvaColumn.setOption)
        console.log(canvaColumn.setOptions)
        this.initLine()
      },
      loadCharts() {
        if (!this.query.productName || !this.query.parameterName) return uni.showToast({title: '请先选择产品和参数', icon: 'none'})
        this.loadDeviceChart({
          id: this.id,
          start: this.query.start + ' ' + this.query.startTime + ':00',
          end: this.query.end + ' ' + this.query.endTime + ':00',
          productName: this.query.productName,
          parameterName: this.query.parameterName,
          callback: res => {
            this.xAxis = []
            this.yAxis = []
            if (res.data.content.length > 0) {
              this.chartData = res.data.content[0]
              this.chartData.statistics.maxVal = this.chartData.statistics.max.toFixed(this.chartData.statistics.decimalDigits)
              this.chartData.statistics.minVal = this.chartData.statistics.min.toFixed(this.chartData.statistics.decimalDigits)
              this.chartData.statistics.avgVal = this.chartData.statistics.avg.toFixed(this.chartData.statistics.decimalDigits)
              let result = this.chartData.result
              let y = []
              let index = 0
              result.forEach(e => {
                //采样显示
                // index++
                // if(index % 5 !== 1) return

                let list = e.ctime.split(' ')
                let dateList = list[0].split('-')
                let timeList = list[1].split(':')
                let date = dateList[1] + '.' + dateList[2] + ' ' + timeList[0] + ':' + timeList[1] + ':' + timeList[2]
                this.xAxis.push(date)

                // y.push(e.value)
                if((this.yMax || this.yMax === 0) && e.value > this.yMax) y.push(this.yMax)
                else if((this.yMin || this.yMin === 0) && e.value < this.yMin) y.push(this.yMin)
                else y.push(e.value)
              })
              this.yAxis = [{
                name: '', // 必传！！！！！！
                data: y,
              }]
              this.initLine()
            } else {
              uni.showToast({title: '暂无数据', icon: 'none'})
            }
          }
        })
      },
      changeName(e) {
        this.nameIdx = e.detail.value
        this.query.productName = this.deviceNameList[this.nameIdx]
        this.loadDeviceParamByName({
          id: this.id,
          productName: this.query.productName,
          callback: res => {
            this.paramIdx = 0
            if (this.deviceNameParamList.length > 0) this.query.parameterName = this.deviceNameParamList[0]
          }
        })
      },
      changeParam(e) {
        this.paramIdx = e.detail.value
        this.query.parameterName = this.deviceNameParamList[this.paramIdx]
      },
      initLine() {
        canvaColumn = new uCharts({
          $this:_self,
          canvasId: 'lineCharts',
          type: 'line',
          legend:{show:false},
          fontSize:12,
          background:'#FFFFFF',
          pixelRatio:_self.pixelRatio,
          categories: _self.xAxis,
          series: _self.yAxis,
          animation: true,
          rotate:false,
          enableScroll: true, // 启动图表滚动
          dataLabel: false, // 是否在图表中显示标注，默认为true
          dataPointShape: false, // 是否在图表中显示数据点图形标识
          xAxis: {
            calibration: true,
            disableGrid:true,
            rotateLabel: true,
            itemCount: 25, //可见区域数据数量
            labelCount: 5, //可见区域标签数量
            // type:'grid',
            // gridColor:'#CCCCCC',
            // gridType:'dash',
            // dashLength:8,
            scrollAlign: 'right',
          },
          yAxis: {
            data: [
              {
                axisLine: false,
                format: (value) => {
                  return (value).toFixed(2)
                },
                min: ( _self.yMin ||  _self.yMin === 0) ? _self.yMin : '',
                max: ( _self.yMax ||  _self.yMax === 0) ? _self.yMax : '',
              },
            ],
            // disableGrid: true,
            // gridType:'dash',
            // gridColor:'#CCCCCC',
            // dashLength:8,
            splitNumber: 10,
          },
          extra: {
            line: {
              type: 'curve'
            }
          },
          // padding: [20, 20, 20, 20],
          width: _self.cWidth*_self.pixelRatio,
          height: _self.cHeight*_self.pixelRatio
        })
      },
      touchLineA(e){
        canvaColumn.scrollStart(e);
      },
      moveLineA(e) {
        canvaColumn.scroll(e);
      },
      touchEndLineA(e) {
        canvaColumn.scrollEnd(e);
        //下面是toolTip事件，如果滚动后不需要显示，可不填写
        canvaColumn.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        });
      },
      fomartYMax(num){
        // num = (num.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        num = (num.match(/^\d*(\d{0,0})/g)[0]) || null
        // 重新赋值给input
        this.$nextTick(() => {
          this.yMax= num
        })
      },
      fomartYMin(num){
        // num = (num.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        num = (num.match(/^\d*(\d{0,0})/g)[0]) || null
        //重新赋值给input
        this.$nextTick(() => {
          this.yMin= num
        })
      },
      switchChange(e){
        console.log('switch2 发生 change 事件，携带值为', e.target.value)
        this.realTimeUpdateFlag = e.target.value
      },
    }
  }
</script>

<style scoped lang="less">
  .device-charts-page {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    .head {
      height: 218rpx;
      background: linear-gradient(180deg, #0086FF 0%, #B5DCFF 100%);
      padding: 60rpx 20rpx 0 20rpx;
      box-sizing: border-box;
      .head-box {
        width: 710rpx;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0 0 12rpx 0 rgba(0,0,0,0.2);
        border-radius: 8rpx;
        padding: 30rpx 0;
        box-sizing: border-box;
        .time-box {
          padding: 0 50rpx 34rpx 50rpx;
          border-bottom: 1px solid #eee;
          .time-text {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24rpx;
            width: 100%;
            box-sizing: border-box;
            font-size: 28rpx;
            color: #999;
          }
          .time-picker {
            display: flex;
            justify-content: space-between;
            .picker {
              display: inline-block;
              vertical-align: middle;
              .time {
                font-size: 28rpx;
                color: #333;
                font-weight: bold;
              }
            }
            image {
              width: 48rpx;
              height: 48rpx;
            }
          }
        }
        .picker-list {
          width: 100%;
          padding: 0 20rpx;
          box-sizing: border-box;
          .picker-item + .picker-item {
            border-top: 1px solid #eee;
          }
          .picker-item {
            height: 100rpx;
            line-height: 100rpx;
            padding: 0 30rpx;
            .text {
              font-size: 28rpx;
              color: #999;
              width: 120rpx;
            }
            .picker {
              width: calc(~"100% - 120rpx");
              height: 100rpx;
              padding-left: 20rpx;
              box-sizing: border-box;
              position: relative;
              .item-text {
                font-size: 28rpx;
                color: #333;
                font-weight: 500;
              }
              &:after {
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 32rpx;
                height: 32rpx;
                background: url('../../static/images/icon/right.png') no-repeat;
                background-size: 100% 100%;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(-50%, -50%;);
              }
            }
          }
        }
        .chart-btn {
          padding: 20rpx 40rpx;
          display: flex;
          .btn {
            flex: 1;
            display: inline-block;
            vertical-align: top;
            font-size: 28rpx;
            background: #f8f3fe;
            color: #0086FF;
            border: 1px solid #0086FF;
            padding: 10rpx;
            text-align: center;
            border-radius: 8rpx;
          }
          .active-btn {
            background: #0086FF;
            color: #fff;
          }
          .btn + .btn {
            margin-left: 20rpx;
          }
        }
        .submit-btn {
          width: 670rpx;
          margin: 20rpx auto 0;
          height: 98rpx;
          background: #0086FF;
          border-radius: 8rpx;
          font-size: 36rpx;
          color: #fff;
          text-align: center;
          line-height: 98rpx;
        }
      }
    }
    .charts-box {
      margin-top: 824rpx;
      padding: 20rpx;
      width: 100%;
      //overflow-x: auto;
      box-sizing: border-box;

      .charts-text {
        margin-bottom: 20rpx;
        view {
          font-size: 24rpx;
          color: #333;
          margin-bottom: 10rpx;
        }
      }
    }
    .charts {
      width: 100%;
      //height: 520rpx;
      //height: 1000rpx;
      box-sizing: border-box;
    }
  }
</style>