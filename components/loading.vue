<template>
  <!--  -->
</template>

<script>
export default {
  data () {
    return {
      loading: null
    }
  },
  methods: {
    start () {
      // 使用 ElementUI 的 Loading service
      this.loading = this.$loading()
    },
    finish () {
      // 以服务的方式调用的 Loading 需要异步关闭
      // this.$nextTick(() => {
      //   this.loading && this.loading.close()
      // })
      setTimeout(() => {
        this.loading && this.loading.close()
      }, 100)
    }
  }
}
</script>

<style scoped>
  /**/
</style>
