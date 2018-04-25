<template>
  <el-form-item :label="label" :error="error">
    <el-input
      :value="value"
      :placeholder="placeholder"
      :size="size"
      :resize="resize"
      :name="name"
      :form="form"
      :id="id"
      :maxlength="maxlength"
      :minlength="minlength"
      :readonly="readonly"
      :autofocus="autofocus"
      :disabled="disabled"
      :type="type"
      :autosize="autosize"
      :rows="rows"
      :autoComplete="autoComplete"
      :max="max"
      :min="min"
      :step="step"
      :validateEvent="validateEvent"
      :suffixIcon="suffixIcon"
      :prefixIcon="prefixIcon"
      :label="label"
      :clearable="clearable"
      :tabindex="tabindex"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange">
    </el-input>
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
    // value: [String, Number],
    placeholder: {
      type: String,
      default: '请输入'
    },
    size: String,
    resize: String,
    name: String,
    form: String,
    id: String,
    maxlength: Number,
    minlength: Number,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    max: {},
    min: {},
    step: {},
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },
  data () {
    return {}
  },
  computed: {
    value () {
      return this.$store.getters[`forms/${this.storeName}/getField`](this.name)
    },
    error () {
      return this.$store.getters[`forms/${this.storeName}/getError`](this.name)
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
    handleInput (value) {
      this.$emit('input', value);
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
