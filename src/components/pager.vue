<template>
  <view class="el-pagination">
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
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
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
        font-size: .21rem;
        color: #606266;
        text-align: center;
      }

      .text {
        display: inline-block;
        vertical-align: top;
        font-size: .21rem;
        color: #606266;
        line-height: .5rem;
      }
    }
  }
</style>
