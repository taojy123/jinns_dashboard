<template>
  <el-menu :default-active="$route.path" :router="true" @open="handleOpen" @close="handleClose" class="side-bar">
    <nuxt-link to="/">
      <img src="https://www.hey.shop/public/images/home/logo-semi.png" alt=" " class="logo">
    </nuxt-link>
    <el-menu-item-group title="产品中心">
      <el-menu-item index="/">
        <i class="icommon icon-home"></i>
        <span>概览</span>
      </el-menu-item>
      <el-submenu index="1-1">
        <template slot="title">
          <i class="icommon icon-products"></i>
          <span>产品管理</span>
        </template>
        <el-menu-item index="/products">产品列表</el-menu-item>
        <el-menu-item index="/categories">产品分类</el-menu-item>
      </el-submenu>
    </el-menu-item-group>
    <el-menu-item-group title="营销中心">
      <el-menu-item index="/customers">
        <i class="icommon icon-customers"></i>
        <span>客户管理</span>
      </el-menu-item>
      <el-menu-item index="/reports">
        <i class="icommon icon-data"></i>
        <span>数据分析</span>
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
    height: 40px;
    margin: 20px;
  }
}
</style>
