<template>
  <section class="auth-box">
    <img src="https://up.img.heidiancdn.com/o_1c9jsbofoarg1iqf14u97fl1lpf0logo.png?imageView2/2/h/100" alt=" " class="auth__logo">
    <el-form ref="form" :model="form" label-width="100px" label-position="top">
      <el-form-item label="" class="auth__form-item">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="" class="auth__form-item">
        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="auth__form-item">
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
      <el-alert v-if="error" :title="error" type="error" show-icon></el-alert>
    </el-form>
  </section>
</template>

<script>
export default {
  head: { title: '登录' },
  meta: { title: '登录' },
  data () {
    return {
      error: null,
      form: {
        email: 'test@jinns.com',
        password: '1234abcd'
      }
    }
  },
  layout: 'auth',
  methods: {
    onSubmit (e) {
      console.log(this.form.email, this.form.password)
      this.error = ''
      this.$store.dispatch('auth/login', {
        email: this.form.email,
        password: this.form.password
      }).then(() => {
        this.$router.push('/products/')
      }).catch((error) => {
        console.log(error)
        this.error = error.response && error.response.data.detail || '登录失败'
      })
    }
  }
}
</script>
