<template>
  <div class="grey-bg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h5 class="pull-left">基本信息</h5>
      </div>
      <el-form label-position="left" :inline="true" :model="customer.data">
        <el-form-item label="姓名" :error="customer.error.full_name | error">
          <el-input v-model="customer.data.full_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="性别" :error="customer.error.gender | error">
          <el-select v-model="customer.data.gender" placeholder="请选择">
            <el-option label="未知" value="unknown"></el-option>
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" :error="customer.error.mobile | error">
          <el-input v-model="customer.data.mobile" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :error="customer.error.id_number | error">
          <el-input v-model="customer.data.id_number" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="地址" :error="customer.error.address | error">
          <el-input v-model="customer.data.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="submitForm"
            :disabled="!isDirty || customer.pending">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'

const formMixin = FormPage('customer', '/crm/customer/')

export default {
  head: { title: '客户详情' },
  meta: { title: '客户详情' },
  components: {},
  mixins: [formMixin],
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" :scoped="true">
@import "assets/stylesheets/core";
.box-card {
  margin: 20px 25px;
  .el-card__body {
    padding: 20px 40px;
  }
}
</style>
