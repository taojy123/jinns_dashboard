<template>
  <el-menu :default-active="$route.path" :router="true" @open="handleOpen" @close="handleClose"
      class="el-menu-vertical-demo side-bar"
      background-color="#FFF" text-color="#080f3a" active-text-color="#222C3C">
    <nuxt-link to="/">
      <img src="/admin/jinnslogo.png" alt="Jinns" class="logo" width="100">
    </nuxt-link>

    <hr class="hr--light">
    <el-menu-item-group title="订房">
      <el-menu-item index="/rooms">
        <i class="icommon icon-employees"></i>
        <span>客房管理</span>
      </el-menu-item>
    </el-menu-item-group>
    <hr class="hr--light">
    <el-menu-item-group title="商城">
      <el-menu-item index="/products">
        <i class="icommon icon-employees"></i>
        <span>产品管理</span>
      </el-menu-item>
    </el-menu-item-group>
    <hr class="hr--light">
    <el-menu-item-group title="订单">
      <el-menu-item index="/orders">
        <i class="icommon icon-contract"></i>
        <span>订单列表</span>
      </el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss">
@import "assets/stylesheets/core";
.side-bar {
  width: 240px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: auto;
  z-index: $zindex-sidebar;
  .logo {
    margin-top: 5px;
    margin-left: 20px;
    margin-bottom: 5px;
  }
  .icommon {
    margin-left: 5px;
    margin-right: 15px;
  }
  .expiry-date {
    margin-top: 50px;
    margin-bottom: 30px;
    font-size: 13px;
    overflow: hidden;
  }
  .expiry-date, .used-days {
    color: $color-white;
  }
  .total-days {
    margin-right: 6px;
    color: $color-dark-text;
  }
  .date-wrapper {
    margin-bottom: 8px;
  }
  .el-menu-item {
    &.is-active {
      background-color: #cdd2da !important;
    }
  }
  .el-menu-item-group__title {
    color: $color-dark-menu;
    font-size: 13px;
  }
  .el-submenu .el-menu-item {
    padding-left: 55px !important;
  }
  .el-submenu__title, .el-menu-item {
    height: 38px;
    line-height: 38px;
  }
  .el-progress-bar {
    width: 220px;
  }
  .el-progress-bar__inner {
    background-color: transparent;
    background-image: linear-gradient(to left, #7d5be2, #9d8fe3);
  }
  .el-progress__text {
    display: none;
  }
}
</style>
