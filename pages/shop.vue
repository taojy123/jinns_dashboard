<template>
  <div class="form-page">
    <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">
      <el-tab-pane label="基本信息" name="1" style="padding: 20px;">

        <el-form label-position="top" :inline="false">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card class="form-page__card" shadow="never">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-x-input-field label="酒店名称" storeName="shop" name="name"></el-x-input-field>
                  </el-col>
                  <el-col :span="16">
                    <el-x-input-field label="地址" storeName="shop" name="address"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="电话" storeName="shop" name="phone"></el-x-input-field>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="form-page__card" shadow="never">
                <el-form-item label="酒店主图">
                  <upload-one-image :value="shop.data.pic" @change="(res) => handleUploadChange(res)" />
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="form-page__actions">
      <el-button type="primary" @click.prevent="submitForm"
        :disabled="!shop.dirty || shop.pending" :loading="shop.pending">保存</el-button>
    </div>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'
import UploadOneImage from '~/components/uploaders/UploadOneImage'

const storeName = 'shop'
const formMixin = FormPage(storeName)

export default {
  head: { title: '酒店信息' },
  meta: { title: '酒店信息' },
  components: {
    UploadOneImage
  },
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
    },
    handleUploadChange ({ src }) {
      this.updateField('pic', src)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/stylesheets/core";
</style>
