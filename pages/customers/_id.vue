<template>
  <div class="form-page">
    <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">
      <el-tab-pane label="基本信息" name="1" style="padding: 20px;">
        <el-form label-position="top" :inline="false" :model="customer.data">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card class="form-page__card" shadow="never">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-x-input-field label="姓名" :storeName="storeName" name="full_name"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="手机号" :storeName="storeName" name="mobile"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-select-field label="性别" :storeName="storeName" name="gender" class="full-width">
                      <el-option label="未知" value="unknown"></el-option>
                      <el-option label="男" value="male"></el-option>
                      <el-option label="女" value="female"></el-option>
                    </el-x-select-field>
                  </el-col>
                  <!-- <el-col :span="16">
                    <el-x-input-field label="地址" :storeName="storeName" name="addresses[0].address1"></el-x-input-field>
                  </el-col> -->
                  <el-col :span="8">
                    <el-x-input-field label="消费次数" :storeName="storeName" name="paid_orders" readonly placeholder="0"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="消费总额(元)" :storeName="storeName" name="total_spent" readonly placeholder="0"></el-x-input-field>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="form-page__card" shadow="never">
                <el-form-item label="用户分组">
                  <segment-select
                    :value="getField('segments')"
                    :multiple="true"
                    @change="(value) => updateField('segment_ids', value)"
                  />
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>


        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="form-page__actions">
      <el-button type="primary" @click.prevent="submitForm"
        :disabled="!customer.dirty || customer.pending" :loading="customer.pending">保存</el-button>
    </div>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'
import SegmentSelect from '~/components/selects/SegmentSelect'

const storeName = 'customer'
const formMixin = FormPage(storeName)

export default {
  head: { title: '客户详情' },
  meta: { title: '客户详情' },
  components: {},
  mixins: [formMixin],
  components: {
    SegmentSelect,
  },
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
