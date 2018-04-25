<template>
  <el-select
    v-model="currentValue"
    @change="handleChange"
    @clear="fetchProducts"
    clearable
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="product in productOptions"
      :key="product.id"
      :label="product.title"
      :value="product.id">
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    value: {
      type: [String, Number],
      required: false
    }
  },
  data () {
    return {
      loading: false,
      productOptions: [],
      currentValue: +this.value || ''
    }
  },
  created () {
    this.fetchProducts()
  },
  mounted () {},
  destroyed () {},
  computed: {},
  watch: {
    value (newVal, oldValue) {
      this.currentValue = newVal
    }
  },
  methods: {
    fetchProducts (searchFilter) {
      this.loading = true
      const url = '/catalogue/product/'
      const params = _.extend({
        page_size: 999,
        fields: ['id', 'title'].join(',')
      }, searchFilter)
      return this.$axios.get(url, { params }).then((res) => {
        this.productOptions = res.data.results
        this.loading = false
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.fetchProducts({ title: query })
      } else {
        this.fetchProducts()
      }
    },
    handleChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
