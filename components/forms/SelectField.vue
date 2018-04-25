<template>
  <el-form-item :label="label" :error="error">
    <el-select
      :value="value"
      :name="name"
      :id="id"
      :autoComplete="autoComplete"
      :size="size"
      :disabled="disabled"
      :multiple="multiple"
      :multipleLimit="multipleLimit"
      :placeholder="placeholder"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange">
      <slot></slot>
    </el-select>
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
    // value: {
    //   required: true
    // },
    label: String,
    name: String,
    id: String,
    autoComplete: {
      type: String,
      default: 'off'
    },
    size: String,
    disabled: Boolean,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: String
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
    handleFocus (event) {
      this.$emit('focus', event);
    },
    handleBlur (event) {
      this.$emit('blur', event);
    }
  }
}
</script>
