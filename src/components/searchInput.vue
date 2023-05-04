<template>
  <view class="search-input-input inline-block">
    <input type="text" placeholder="输入名称搜索" v-model="searchName" @confirm="search" @input="getShow" @click="getShow">
    <view class="search-input-content" v-show="show">
      <view class="content-list" v-if="content.length > 0">
        <view class="item" v-for="(item, i) in content" :key="i" @click="getItem(item)">{{item.name}}</view>
      </view>
      <view class="nothing" v-else>暂无数据</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        searchName: '',
        show: false
      }
    },
    props: {
      name: String,
      content: Array
    },
    watch: {
      name() {
        this.searchName = this.name
      }
    },
    methods: {
      search() {
        this.show = true
        this.$emit('remote', this.searchName)
      },
      getItem(item) {
        this.show = false
        this.searchName = item.name
        this.$emit('getItem', item)
      },
      getShow() {
        this.show = false
      }
    }
  }
</script>

<style lang="less">
  .search-input-input {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    height: .55rem;
    font-size: .23rem;
    color: #3B4859;

    * {
      box-sizing: border-box;
    }

    input {
      height: .55rem;
      min-height: .55rem;
      line-height: .55rem;
      border: 1px solid #DCDFE6;
      border-radius: .1rem;
      font-size: .23rem;
      padding: 0 .2rem;
      box-sizing: border-box;
      color: #3B4859;
    }

    .search-input-content {
      border-radius: .1rem;
      box-shadow: 0 .14rem .64rem 0 rgba(169, 169, 169, .37);
      width: 100%;
      max-height: 2.75rem;
      overflow-y: auto;
      position: absolute;
      top: .6rem;
      left: 0;
      background-color: #fff;
      z-index: 10;

      .content-list {
        .item {
          cursor: pointer;
          font-size: .23rem;
          color: #3B4859;
          padding: 0 .2rem;
          box-sizing: border-box;
          width: 100%;
          line-height: .55rem;

          &:focus {
            background-color: #F9FAFC;
          }
        }
      }

      .nothing {
        padding: .2rem 0;
      }
    }
  }
</style>
