<template>
  <view class="table-page">
    <view class="el-table">
      <view class="table-content">
        <view class="row header">
          <view v-if="selection" class="col checkbox">
            <checkbox-group @change="selectAll">
              <checkbox value="cb" :checked="checkedAll"/>
            </checkbox-group>
          </view>
          <view v-if="index" class="col index">序号</view>
          <view v-for="col in column" :key="col.prop" class="col" :style="{width: col.width}">{{col.label}}</view>
        </view>
        <view class="row" v-for="(row, i) in lists" :key="row.id" @click="getLine(row, i)">
          <view v-if="selection" class="col checkbox">
            <checkbox-group @change="selectCol(row, $event)">
              <checkbox :value="i + ''" :checked="checked"/>
            </checkbox-group>
          </view>
          <view v-if="index" class="col index">{{row.index + 1}}</view>
          <view v-for="col in column" :key="col.prop" class="col" :style="{width: col.width}">
            <text>{{row[col.prop]}}</text>
            <slot v-if="col.prop === 'opt'" :row="row"></slot>
          </view>
        </view>
      </view>
    </view>
    <view class="nothing" v-if="lists.length <= 0">暂无数据</view>
    <view v-if="page" class="el-pagination">
      <view class="total">共 {{page.totalElements}} 条</view>
      <view class="right">
        <img class="btn"
             :class="{disabled: page.number === 0}"
             src="https://cdn.xun-qi.cn/manjk/project/nurse/components/table/arrow_left.png"
             @click="lastPage"/>
        <view class="pager">
          <text v-for="(item, i) in pageList"
                :key="i"
                class="number"
                :class="{active: page.number + 1 === item}"
                @click="changePage(item)">
            {{item}}
          </text>
        </view>
        <img class="btn"
             :class="{disabled: page.number + 1 === page.totalPages}"
             src="https://cdn.xun-qi.cn/manjk/project/nurse/components/table/arrow_right.png"
             @click="nextPage"/>
        <view class="jump">
          <text class="text">前往</text>
          <input class="jump-input"
                 type="number"
                 autocomplete="off"
                 :value="page.number + 1"
                 @confirm="jumpPage"/>
          <text class="text">页</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        checked: false,
        checkedAll: false
      }
    },
    props: {
      index: Boolean,
      selection: Boolean,
      column: Array,
      list: Array,
      page: {
        size: 10,
        number: 1,
        totalElements: 400,
        totalPages: 40,
        first: true,
        last: true,
      }
    },
    computed: {
      lists() {
        const list = this.page ? this.page.content : this.list
        list.forEach((e, i) => {
          e.index = i
          Object.keys(e).forEach(keys => {
            if (JSON.stringify(e[keys]) === 'null') e[keys] = ''
          })
        })
        return list
      },
      pageList() {
        const current = this.page.number + 1
        const total = this.page.totalPages
        // 页码左边拼接2个
        const res = [current]
        if (current > 1) res.splice(0, 0, current - 1)
        if (current > 2) res.splice(0, 0, current - 2)
        // 页码右边拼接2个
        const leftLen = res.length
        for (let i = 1; i <= 5 - leftLen; i++) {
          if (current + i <= total) res.push(current + i)
        }
        // 右边不足5个重新拼接左边
        const rightLen = res.length
        for (let i = 1; i <= 5 - rightLen; i++) {
          const value = res[0] - 1
          if (value >= 1) res.splice(0, 0, value)
        }
        // 左边拼接...和首页
        const first = res[0]
        if (first > 2) res.splice(0, 0, '...')
        if (first > 1) res.splice(0, 0, 1)
        // 右边拼接...和尾页
        const last = res[res.length - 1]
        if (last < total - 1) res.push('...')
        if (last < total) res.push(total)
        return res
      }
    },
    methods: {
      getLine(item, i) {
        let model = {
          item,
          i
        }
        this.$emit('getColumn', model)
      },
      selectCol(item, e) {
        let model = {
          item,
          idxList: e.detail.value
        }
        this.$emit('selectColumn', model)
      },
      selectAll(e) {
        if (e.detail.value.length > 0) this.checked = true
        else this.checked = false
        this.$emit('selectAll', this.checked)
      },
      changePage(val) {
        this.page.number = val - 1
        this.$emit('changePage', this.page.number)
      },
      lastPage() {
        let num = this.page.number
        num--
        if (num < 0) return
        this.page.number = num
        this.$emit('changePage', this.page.number)
      },
      nextPage() {
        let num = this.page.number
        num++
        if (num > this.page.totalPages - 1) return
        this.page.number = num
        this.$emit('changePage', this.page.number)
      },
      jumpPage(e) {
        const num = e.target.value
        if (!num
          || num < 1
          || num > this.page.totalPages
          || num === this.page.number - 1) return
        this.page.number = num - 1
        this.$emit('changePage', this.page.number)
      }
    }
  }
</script>

<style lang="less">
  .table-page {
    width: 100%;
    background: #fff;
    padding: .2rem;
    border-radius: .08rem;
    box-sizing: border-box;

    .el-table {
      box-sizing: border-box;
      width: 100%;
      overflow-x: auto;

      // &::-webkit-scrollbar {
      //   display: none;
      //   width: 0 !important;
      //   height: 0 !important;
      //   -webkit-appearance: none;
      //   background: transparent;
      // }
    }

    .table-content {
      display: table;
      min-width: 100%;
      box-sizing: border-box;

      .header {
        font-weight: bold;

        .col {
          color: #44444F;
          background-color: #F2F6FC;
          font-size: .23rem;
        }
      }

      .row {
        display: table-row;


        .col {
          display: table-cell;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: .2rem;
          font-size: .21rem;
          color: #8392A7;
          max-width: 4rem;
          border-bottom: 1px solid #F5F7FA;


          &.index {
            width: 1rem;
            text-align: center;
          }

          &.checkbox {
            width: .8rem;
            text-align: center;
          }
        }
      }
    }

    .el-pagination {
      line-height: .6rem;
      margin-top: .2rem;

      * {
        vertical-align: middle;
      }

      .total {
        display: inline-block;
        font-size: .21rem;
        color: #606266;
      }

      .right {
        float: right;
        margin-top: .06rem;
      }

      .pager {
        display: inline-block;
        vertical-align: top;

        .number {
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
          font-size: .21rem;
          color: #606266;
          padding: 0 .2rem;
          line-height: .5rem;

          &.active {
            color: #1989FA;
            cursor: not-allowed;
          }
        }
      }

      .btn {
        display: inline-block;
        vertical-align: top;
        cursor: pointer;
        width: .24rem;
        height: .24rem;
        margin: .1rem .1rem 0;

        &.disabled {
          cursor: not-allowed;
          opacity: .5;
        }
      }

      .jump {
        display: inline-block;
        margin-left: .3rem;

        .jump-input {
          display: inline-block;
          vertical-align: top;
          width: 0.6rem;
          min-height: .35rem;
          height: 0.35rem;
          line-height: .35rem;
          padding: 0;
          border-radius: 0.06rem;
          border: 0.01rem solid #DCDFE6;
          margin: .07rem .12rem 0;
          font-size: .15rem;
          color: #606266;
          text-align: center;
        }

        .text {
          display: inline-block;
          vertical-align: top;
          font-size: .15rem;
          color: #606266;
          line-height: .5rem;
        }
      }
    }

  }
</style>
