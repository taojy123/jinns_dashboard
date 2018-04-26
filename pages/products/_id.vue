<template>
  <div class="form-page">
    <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">
      <el-tab-pane label="基本信息" name="1" style="padding: 20px;">

        <el-form label-position="top" :inline="false" >
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card class="form-page__card" shadow="never">
                <el-row :gutter="10">
                  <el-col :span="16">
                    <el-x-input-field label="商品名称" storeName="product" name="name"></el-x-input-field>
                  </el-col>
                  <el-col :span="8">
                    <el-x-input-field label="价格" storeName="product" name="price"></el-x-input-field>
                  </el-col>
                  <el-col :span="24">
                    <el-x-input-field label="描述" storeName="product" name="description"></el-x-input-field>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="form-page__card" shadow="never">
                <el-form-item label="商品主图">
                  <upload-one-image :value="product.data.pic" @change="(res) => handleUploadChange(res)" />
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="form-page__actions">
      <el-button type="primary" @click.prevent="submitForm"
        :disabled="!product.dirty || product.pending" :loading="product.pending">保存</el-button>
    </div>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'
import UploadOneImage from '~/components/uploaders/UploadOneImage'

const storeName = 'product'
const formMixin = FormPage(storeName)

export default {
  head: { title: '商品详情' },
  meta: { title: '商品详情' },
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
