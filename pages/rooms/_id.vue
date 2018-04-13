<template>
  <div class="grey-bg">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h5 class="pull-left">基本信息</h5>
      </div>
      <el-form label-position="left" :inline="false" :model="room.data">
        <el-form-item label="房型名称" :error="room.error.name | error">
          <el-input v-model="room.data.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="价格" :error="room.error.price | error">
          <el-input v-model="room.data.price" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="数量" :error="room.error.quantity | error">
          <el-input v-model="room.data.quantity" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="床型" :error="room.error.bed_type | error">
          <el-input v-model="room.data.bed_type" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="床宽" :error="room.error.bed_width | error">
          <el-input v-model="room.data.bed_width" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="入住人数" :error="room.error.capacity | error">
          <el-input v-model="room.data.capacity" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="楼层" :error="room.error.floor | error">
          <el-input v-model="room.data.floor" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="面积" :error="room.error.area | error">
          <el-input v-model="room.data.area" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="窗户" :error="room.error.window | error">
          <el-select v-model="room.data.window" placeholder="请选择">
            <el-option label="有窗" value="有窗"></el-option>
            <el-option label="无窗" value="无窗"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="submitForm"
            :disabled="!isDirty || room.pending">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'

const formMixin = FormPage('room', '/book/rooms/')

export default {
  head: { title: '客房详情' },
  meta: { title: '客房详情' },
  components: {},
  mixins: [formMixin],
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" :scoped="true">
@import "../../assets/stylesheets/core";
.box-card {
  margin: 20px 25px;
  .el-card__body {
    padding: 20px 40px;
  }
}
</style>
