<template>
<div class="form-page">
  <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">

    <el-tab-pane label="基本信息" name="1" style="padding: 20px;">
      <el-form label-position="top" :inline="false" :model="product.data" ref="productForm">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card class="form-page__card" shadow="never">
              <!--<el-x-input-field label="产品SKU" :storeName="storeName" name="sku"></el-x-input-field>-->
              <el-form-item label="商品链接" :error="getError('name')">
                <el-input type="text"
                  :value="getField('name')"
                  @change="(value) => updateField('name', value)">
                  <template slot="prepend">https://mhdchina.heidianer.com/products/</template>
                  <el-button slot="append" icon="el-icon-view" @click="previewProduct"></el-button>
                </el-input>
              </el-form-item>
              <el-x-input-field label="系统标题" :storeName="storeName" name="title"></el-x-input-field>
              <!-- <el-x-input-field type="textarea" label="备注" :storeName="storeName" name="notes"></el-x-input-field> -->
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="form-page__card" shadow="never">
              <!--<el-x-input-field label="产品SKU" :storeName="storeName" name="sku"></el-x-input-field>-->
              <el-form-item label="分类" :error="getError('category_ids')">
                <category-select
                  placeholder="选择商品分类"
                  :value="getField('category_ids')"
                  @change="(value) => updateField('category_ids', value)">
                </category-select>
              </el-form-item>
              <el-x-select-field label="是否上架" :storeName="storeName" name="published">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-x-select-field>
              <!-- <el-form-item label="上架时间" :error="getError('published_at')">
                <el-date-picker type="date"
                  :value="getField('published_at')"
                  @change="(value) => updateField('published_at', value)">
                </el-date-picker>
              </el-form-item> -->
            </el-card>
          </el-col>
        </el-row>
        <!-- <el-form-item>
          <el-button type="primary" @click.prevent="submitForm"
            :disabled="!product.dirty || product.pending" :loading="product.pending">提交</el-button>
        </el-form-item> -->
      </el-form>
      <el-card v-if="!getField('options', []).length" class="form-page__card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="pull-left">商品价格</span>
          <el-button
            type="text" icon="el-icon-edit"
            class="pull-right" :style="{'padding':'3px 0'}"
            @click="enableOptions">
            添加多个商品价格
          </el-button>
        </div>
        <el-form label-position="top" :inline="true" :model="product.data">
          <el-x-input-field :storeName="storeName" label="SKU" name="variants[0].sku"></el-x-input-field>
          <el-x-input-field :storeName="storeName" label="条形码" name="variants[0].barcode"></el-x-input-field>
          <el-x-input-field :storeName="storeName" label="价格(元)" name="variants[0].price"></el-x-input-field>
          <el-x-input-field :storeName="storeName" label="原价(元)" name="variants[0].compare_at_price"></el-x-input-field>
          <el-x-input-field :storeName="storeName" label="重量(g)" name="variants[0].grams"></el-x-input-field>
          <el-x-input-field :storeName="storeName" label="库存" name="variants[0].inventory_quantity"></el-x-input-field>
        </el-form>
      </el-card>
      <product-variants v-else :storeName="storeName"></product-variants>
    </el-tab-pane>

    <el-tab-pane label="描述信息" name="2" style="padding: 20px;">
      <el-card class="form-page__card" shadow="never" header="商品图片">
        <upload-images
            :value="getField('images')"
            :limit="5"
            @change="(value) => updateField('images', value)"/>
        </el-form-item>
      </el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="form-page__card" shadow="never">
            <el-form label-position="top" :inline="false" :model="product.data">
              <el-col :span="12">
                <el-form-item label="Sap title(CN)" :error="getMetafieldError('cn', 'sap_title')">
                  <el-input
                    :value="getMetafield('cn', 'sap_title')"
                    @change="(value) => updateMetafield('cn', 'sap_title', value)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Sap title(EN)" :error="getMetafieldError('en', 'sap_title')">
                  <el-input
                    :value="getMetafield('en', 'sap_title')"
                    @change="(value) => updateMetafield('en', 'sap_title', value)">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Estaff title(CN)" :error="getMetafieldError('cn', 'estaff_title')">
                  <el-input
                    :value="getMetafield('cn', 'estaff_title')"
                    @change="(value) => updateMetafield('cn', 'estaff_title', value)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Estaff title(EN)" :error="getMetafieldError('en', 'estaff_title')">
                  <el-input
                    :value="getMetafield('en', 'estaff_title')"
                    @change="(value) => updateMetafield('en', 'estaff_title', value)">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Place of origin(CN)" :error="getMetafieldError('cn', 'place_of_origin')">
                  <el-input
                    :value="getMetafield('cn', 'place_of_origin')"
                    @change="(value) => updateMetafield('cn', 'place_of_origin', value)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Place of origin(EN)" :error="getMetafieldError('en', 'place_of_origin')">
                  <el-input
                    :value="getMetafield('en', 'place_of_origin')"
                    @change="(value) => updateMetafield('en', 'place_of_origin', value)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Size" :error="getMetafieldError('attributes', 'size')">
                  <el-input-number name="limit"
                    :min="0"
                    :max="10000000"
                    :value="+getMetafield('attributes', 'size') || 0"
                    @change="(value) => updateMetafield('attributes', 'size', value, 'integer')">
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Status" :error="getMetafieldError('checkout', 'status')">
                  <el-select :value="getMetafield('checkout', 'status')" placeholder="请选择" @change="(value) => updateMetafield('checkout', 'status', value)">
                    <el-option
                      label="Good"
                      value="good">
                    </el-option>
                    <el-option
                      label="Defective"
                      value="defective">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="Discount" :error="getMetafieldError('checkout', 'discount')">
                  <el-input name="discount"
                    :value="getMetafield('checkout', 'discount')"
                    @change="(value) => updateMetafield('checkout', 'discount', value)">
                    <template slot="append">% Off</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Net price" :error="getMetafieldError('checkout', 'net_price')">
                  <el-input name="net_price"
                    :value="getMetafield('checkout', 'net_price')"
                    @change="(value) => updateMetafield('checkout', 'net_price', value)">
                    <template slot="append">RMB</template>
                  </el-input>
                </el-form-item>
               </el-col>
              <el-col :span="6">
                <el-form-item label="Limit" :error="getMetafieldError('checkout', 'limit')">
                  <el-input-number name="limit"
                    :min="0"
                    :max="10000000"
                    :value="+getMetafield('checkout', 'limit') || 0"
                    @change="(value) => updateMetafield('checkout', 'limit', value, 'integer')">
                  </el-input-number>
                </el-form-item>
               </el-col>
              <el-col :span="24">
                <!-- <el-form-item>
                  <el-button type="primary" @click.prevent="submitForm"
                    :disabled="!product.dirty || product.pending" :loading="product.pending">提交</el-button>
                </el-form-item> -->
              </el-col>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="价格规则" name="3" style="padding: 20px;">
      <el-card class="form-page__card" shadow="never">正在开发...</el-card>
    </el-tab-pane>

  </el-tabs>
  <div class="form-page__actions">
    <el-button type="primary" @click.prevent="submitForm"
      :disabled="!product.dirty || product.pending" :loading="product.pending">保存</el-button>
    <a target="_blank" :style="{'margin':'10px 15px'}"
      :href="`https://mhdchina.heidianer.com/products/${product.data.name}`">预览</a>
  </div>
</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import CategorySelect from '~/components/selects/CategorySelect'
import UploadImages from '~/components/uploaders/UploadImages'
import FormPage from '~/mixins/FormPage'
import ProductVariants from '~/components/products/ProductVariants'

const storeName = 'product'
const formMixin = FormPage(storeName)

export default {
  head: { title: '商品详情' },
  meta: { title: '商品详情' },
  components: {
    CategorySelect,
    ProductVariants,
    UploadImages
  },
  mixins: [ formMixin ],
  asyncData ({ store, params }) {
    if (params.id === 'new') {
      const data = {
        product_type_id: 1,
        options: [],
        variants: [{ options: [] }]
      }
      store.commit(`forms/${storeName}/reset`, { data })
    } else {
      store.commit(`forms/${storeName}/reset`, { id: params.id })
      return store.dispatch(`forms/${storeName}/retrieve`)
    }
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
  computed: {
    ...mapGetters(`forms/${storeName}`, [
      'getMetafield'
    ])
  },
  methods: {
    enableOptions () {
      this.$store.commit(`forms/${storeName}/addOption`, { title: '标题' })
    },
    previewProduct () {
      this.getField('name') && window.open(`https://mhdchina.heidianer.com/products/${this.getField('name')}`)
    },
    updateMetafield (namespace, key, value, value_type) {
      this.$store.commit(`forms/${storeName}/updateMetafield`, { namespace, key, value, value_type })
    },
    getMetafieldError () {
      return null
    },
    updateHash (name) {
      this.$router.replace(this.$route.fullPath.split('#')[0] + `#${name}`)
    },
    handleClickTab (tab, event) {
      // console.log(tab, event)
      this.updateHash(tab.name)
    },
    addVariant () {
      const data = _.omit(_.last(this.variants), ['id', 'sku', 'barcode'])
      this.$store.commit(`forms/${this.storeName}/addVariant`, { data })
      this.$nextTick(() => {
        const formPage = document.querySelector('.form-page')
        formPage.parentElement.scrollTop = 99999999
      })
    },
    removeVariant (index) {
      this.$store.commit(`forms/${this.storeName}/removeVariant`, { index })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "assets/stylesheets/core";
.form-page__actions {
  position: absolute;
  right: 20px;
  top: 10px;
}
</style>
