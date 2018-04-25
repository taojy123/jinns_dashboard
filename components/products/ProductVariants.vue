<template>
<el-card class="form-page__card" :body-style="{'padding':0}" shadow="never">
  <div slot="header" class="clearfix">
    <span class="pull-left">商品价格</span>
    <el-button
      type="text" icon="el-icon-circle-plus-outline"
      class="pull-right" :style="{'padding':'3px 0'}"
      @click="addVariant">
      点击添加价格
    </el-button>
    <el-button
      type="text" icon="el-icon-edit"
      class="pull-right" :style="{'padding':'3px 0', 'margin-right':'20px'}"
      @click="showOptionsDialog">
      编辑价格选项
    </el-button>
  </div>
  <template v-if="getError('variants')">
    <el-alert :title="getError('variants')" :closable="false" type="error" show-icon></el-alert>
  </template>
  <el-table tooltip-effect="dark" :data="variants" v-loading="product.pending">
    <el-table-column :label="label" :key="field"
      v-for="[label, field] in [['SKU', 'sku'], ['条形码', 'barcode'],
                                ['价格', 'price'], ['原价', 'compare_at_price'],
                                ['重量', 'grams'], ['库存', 'inventory_quantity']]">
      <template slot-scope="scope">
        <el-input v-if="editingIndex === scope.$index"
          :value="scope.row[field]" size="small"
          @change="(value) => updateField(`variants[${scope.$index}][${field}]`, value)">
        </el-input>
        <span v-else>{{ scope.row[field] }}</span>
      </template>
    </el-table-column>
    <el-table-column :key="option.title" v-for="(option, i) in options"
      :render-header="(createElement) => createElement('el-tag', {
        domProps: { innerHTML: option.title },
        props: { type: '', size: 'small' }
      })">
      <template slot-scope="scope">
        <el-input v-if="editingIndex === scope.$index"
          :value="getField(`variants[${scope.$index}].options[${i}].value`)" size="small"
          @change="(value) => updateField(`variants[${scope.$index}].options[${i}].value`, value)">
        </el-input>
        <span v-else>{{ getField(`variants[${scope.$index}].options[${i}].value`) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="actions" label="操作" width="160">
      <template slot-scope="scope">
        <template v-if="editingIndex === scope.$index">
          <el-button type="primary" @click="handleInlineConfirm()">确定</el-button>
        </template>
        <template v-else>
          <el-button size="mini" type="primary" icon="el-icon-edit-outline" circle
            @click="handleInlineEdit(scope.$index)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle
            @click="removeVariant(scope.$index)"></el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="编辑价格选项" width="400px" :visible.sync="optionsDialogVisible">
    <el-form label-width="60px">
      <el-form-item :label="`选项 ${i+1}`" :key="option.title" v-for="(option, i) in options">
        <el-input
          :style="{'width':'250px','margin-right':'10px'}"
          :name="`options[${i}].title`" :value="option.title"
          @change="(value) => updateOption(i, value)">
        </el-input>
        <el-button
          v-if="i > 0 || variants.length === 1"
          size="mini" type="danger" icon="el-icon-delete" circle
          @click="() => removeOption(i)"></el-button>
        <el-tooltip
          v-else effect="dark" placement="top-start"
          content="有多个商品价格时至少保留一个价格选项">
          <span :style="{'display':'inline-block'}"><i class="el-icon-question"></i></span>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="options.length < 3">
        <el-button type="text" icon="el-icon-circle-plus-outline" @click="addOption">添加选项</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="optionsDialogVisible = false">确定</el-button>
    </span>
  </el-dialog>
</el-card>
</template>

<script>
import _ from 'lodash'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      optionsDialogVisible: false,
      editingIndex: null
    }
  },
  computed: {
    product () {
      return this.$store.state['forms'][this.storeName]
    },
    options () {
      return this.getField('options') || []
    },
    variants () {
      return this.getField('variants') || []
    }
  },
  methods: {
    showOptionsDialog () {
      this.optionsDialogVisible = true
    },
    getField (path) {
      return this.$store.getters[`forms/${this.storeName}/getField`](path)
    },
    getError (path) {
      return this.$store.getters[`forms/${this.storeName}/getError`](path)
    },
    updateField (path, value) {
      this.$store.commit(`forms/${this.storeName}/updateField`, { path, value })
    },
    addOption () {
      const title = `选项 ${this.options.length+1}`
      this.$store.commit(`forms/${this.storeName}/addOption`, { title })
    },
    updateOption (index, title) {
      this.$store.commit(`forms/${this.storeName}/updateOption`, { index, title })
    },
    removeOption (index) {
      this.$store.commit(`forms/${this.storeName}/removeOption`, { index })
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
    async handleSave () {
      await this.$store.dispatch(`forms/${this.storeName}/save`)
      this.$message({ message: '保存成功', type: 'success' })
      this.editingIndex = null
    },
    handleInlineEdit (index) {
      this.editingIndex = index
    },
    handleInlineConfirm () {
      this.editingIndex = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/stylesheets/core";
</style>
