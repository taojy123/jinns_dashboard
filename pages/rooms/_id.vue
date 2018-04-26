<template>
  <div class="form-page">
    <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">
      <el-tab-pane label="基本信息" name="1" style="padding: 20px;">

        <el-form label-position="top" :inline="false" :model="room.data">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card class="form-page__card" shadow="never">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-x-input-field label="房型名称" storeName="room" name="name"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="价格" storeName="room" name="price"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="数量" storeName="room" name="quantity"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="床型" storeName="room" name="bed_type"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="床宽" storeName="room" name="bed_width"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="入住人数" storeName="room" name="capacity"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="楼层" storeName="room" name="floor"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="面积" storeName="room" name="area"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-select-field label="窗户" storeName="room" name="window" class="full-width">
                      <el-option label="有窗" value="有窗"></el-option>
                      <el-option label="无窗" value="无窗"></el-option>
                    </el-x-select-field>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="form-page__card" shadow="never">
                <el-form-item label="用户分组">
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="form-page__actions">
      <el-button type="primary" @click.prevent="submitForm"
        :disabled="!room.dirty || room.pending" :loading="room.pending">保存</el-button>
    </div>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'

const storeName = 'room'
const formMixin = FormPage(storeName)

export default {
  head: { title: '客房详情' },
  meta: { title: '客房详情' },
  components: {},
  mixins: [formMixin],
  data () {
    let hash = this.$route.hash.slice(1)
    if (!/[1-3]/.test(hash)) {
      hash = '1'
      this.updateHash(hash)
    }
    return {
      storeName,
      activeTab: hash
    }
  },
  methods: {
    updateHash (name) {
      this.$router.replace(this.$route.fullPath.split('#')[0] + `#${name}`)
    },
    handleClickTab (tab, event) {
      this.updateHash(tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/stylesheets/core";
</style>
