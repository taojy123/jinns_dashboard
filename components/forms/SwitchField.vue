<template>
  <el-form-item :label="label" :error="error">
    <el-switch
      :value="value"
      :name="name"
      @change="handleChange">
    </el-switch>
  </el-form-item>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    storeName: {
      type: String,
      required: true
    },
    label: String,
    name: String,
  },
  data () {
    return {}
  },
  computed: {
    value () {
      return this.$store.getters[`forms/${this.storeName}/getField`](this.name)
    },
    error () {
      let error = this.$store.getters[`forms/${this.storeName}/getError`](this.name)
      if (_.isArray(error)) {
        return error.join(', ')
      } else {
        return _.toString(error)
      }
    }
  },
  methods: {
    handleChange (value) {
      this.$store.commit(`forms/${this.storeName}/updateField`, {
        path: this.name,
        value: value
      })
      this.$emit('change', value)
    },
  }
}
</script>
