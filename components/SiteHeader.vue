<template>
  <div class="site-header well-box-m clearfix">
    <template>
      <div class="back-nav pull-left" v-if="needsBack">
        <router-back class="back-link">
          <i class="el-icon-arrow-left"></i>
          <span>返回</span>
        </router-back>
        <span class="back-nav__title">{{title}}</span>
      </div>
      <h4 class="pull-left" v-else>{{title}}</h4>
    </template>
    <div class="pull-right">
      <nuxt-link class="nav-item" to="/">
        <i class="icon-ticket"></i>
        <span>工单</span>
      </nuxt-link>
      <nuxt-link class="nav-item" to="/">
        <i class="icon-news"></i>
        <span>消息</span>
      </nuxt-link>
      <nuxt-link class="nav-item" to="/">
        <i class="icon-profile"></i>
        <span>账户中心</span>
        <i class="icon-dropdown"></i>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import RouterBack from '~/components/RouterBack'
export default {
  components: {
    RouterBack
  },
  data () {
    return {
      title: this.$store.state.header.title || 'Nuxt'
    }
  },
  computed: {
    needsBack () {
      return !!this.$route.params.id
    }
  },
  watch: {
    $route () {
      /*
      ** this.title 不能放进 computed, 因为 setTitle 是在 route middleware 里进行的
      ** title 放进 computed 会出现 header 上的 title 先改变, 再切换页面
      */
      this.title = this.$store.state.header.title || 'Nuxt'
    }
  }
}
</script>

<style lang="scss">
@import "assets/stylesheets/core";
.site-header {
  height: 62px;
  overflow: hidden;
}
</style>
