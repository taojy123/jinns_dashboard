<template>
  <el-menu :default-active="$route.path" :router="true" @open="handleOpen" @close="handleClose"
      class="el-menu-vertical-demo side-bar"
      background-color="#FFF" text-color="#080f3a" active-text-color="#222C3C">
    <nuxt-link to="/">
      <img src="https://up.img.heidiancdn.com/o_1c9jsbofoarg1iqf14u97fl1lpf0logo.png?imageView2/2/h/45" alt=" " class="logo">
    </nuxt-link>
    <hr class="hr--light">
    <el-menu-item-group title="订单中心">
      <el-menu-item index="/orders">
        <i class="icommon icon-contract"></i>
        <span>订单列表</span>
      </el-menu-item>
    </el-menu-item-group>
    <hr class="hr--light">
    <el-menu-item-group title="产品中心">
      <!-- <el-menu-item index="/">
        <i class="icommon icon-home"></i>
        <span>概览</span>
      </el-menu-item> -->
      <el-submenu index="1-3">
        <template slot="title">
          <i class="icommon icon-products"></i>
          <span>产品管理</span>
        </template>
        <el-menu-item index="/products">产品列表</el-menu-item>
        <el-menu-item index="/categories">产品分类</el-menu-item>
      </el-submenu>
    </el-menu-item-group>
    <hr class="hr--light">
    <el-menu-item-group title="营销中心">
      <el-menu-item index="/customers">
        <i class="icommon icon-employees"></i>
        <span>客户管理</span>
      </el-menu-item>
      <el-menu-item index="/segments">
        <i class="icommon icon-customers"></i>
        <span>客户分组</span>
      </el-menu-item>
    </el-menu-item-group>
    <!-- <hr class="hr--light">
    <div class="expiry-date well-box-m">
      <div class="date-wrapper clearfix">
        <div class="pull-left">账户到期时间</div>
        <div class="pull-right">
          <span class="used-days">220</span>
          <span class="total-days">/365天</span>
        </div>
      </div>
      <el-progress :percentage="70"></el-progress>
    </div> -->
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
    margin-top: 30px;
    margin-left: 52px;
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
