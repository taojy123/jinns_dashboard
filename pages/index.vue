<template>
</template>

<script>
export default {
  head: { title: '概览' },
  meta: { title: '概览' },
  components: {},
  mounted () {
    this.$router.replace('/rooms')
  }
}
</script>

<style lang="scss">
@import "assets/stylesheets/core";
.overview {
  color: $color-label;
  .overview-main {
    padding: 30px;
  }
  .overview-item {
    margin-bottom: 20px;
  }
  .white-bg {
    background-color: $color-white;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
  }
}
</style>
