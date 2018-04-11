<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="邮箱">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  head: { title: '登录' },
  meta: { title: '登录' },
  data () {
    return {
      form: {
        email: 'email@example.com',
        password: '1234abcd'
      }
    }
  },
  methods: {
    onSubmit (e) {
      console.log(this.form.email, this.form.password)
      this.$store.dispatch('auth/login', {
        email: this.form.email,
        password: this.form.password
      }).then(() => {
        this.$router.push('/catalogue/products/')
      })
    }
  }
}
</script>
