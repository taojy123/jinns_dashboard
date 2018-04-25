<template>
  <el-select
    v-if="segmentOptions.length"
    v-model="segmentIds"
    @change="handleChange"
    @clear="fetchSegments"
    clearable
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :multiple="multiple"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="(item, index) in segmentOptions"
      :key="index"
      :label="item.title"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    value: {
      type: [String, Number, Array],
      required: false,
      default () {
        return []
      }
    },
    multiple: {
      type: Boolean,
      required: false
    },
  },
  data () {
    return {
      loading: false,
      segmentOptions: [],
      segmentIds: this.value ? _.map(this.value, (v) => +v.id) : []
    }
  },
  created () {
    this.fetchSegments()
  },
  mounted () {

  },
  destroyed () {},
  computed: {
  },
  watch: {
    value (newVal, oldValue) {
      // this.currentValue = newVal
    }
  },
  methods: {
    fetchSegments (searchFilter) {
      this.loading = true
      const url = '/crm/segment/'
      const params = _.extend({
        fields: ['id', 'title'].join(',')
      }, searchFilter || {})
      return this.$axios.get(url, { params }).then((res) => {
        this.segmentOptions = res.data.results
        this.loading = false
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.fetchSegments({ title: query })
      } else {
        this.fetchSegments()
      }
    },
    handleChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
