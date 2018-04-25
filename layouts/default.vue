<template>
  <div class='app-frame'>
    <aside>
      <sidebar/>
    </aside>
    <header>
      <site-header/>
    </header>
    <main>
      <nuxt/>
    </main>
  </div>
</template>

<script>
import SiteHeader from '~/components/SiteHeader.vue'
import Sidebar from '~/components/Sidebar.vue'
export default {
  components: {
    SiteHeader,
    Sidebar
  },
  middleware: 'updateHeader'
}
</script>

<!-- <style src="element-ui/lib/theme-default/index.css"></style> -->
<style lang='scss'>
  @import "assets/stylesheets/core";
  .app-frame {
    position: relative;
    min-height: 100vh;
    padding-left: 240px;
    padding-top: 60px;
    // &::after {
    //   clear: both;
    //   content: "";
    //   display: block;
    // }
    > header {
      height: 60px;
      @include position(fixed, 0 0 auto 240px);
      z-index: $zindex-header;
    }
    > aside {
      // visibility: hidden;
      min-height: 100vh;
      width: 240px;
      @include position(fixed, 0 auto 0 0);
      z-index: $zindex-sidebar;
    }
    > main {
      min-height: calc(100vh-60px);
      min-width: 980px;
    }
    > aside, > main {
      overflow: hidden;
    }
  }
</style>
