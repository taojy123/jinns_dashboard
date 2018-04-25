<template>
  <div class="clearfix">
    <div class="uploader-wrapper pull-left" v-for="(item, index) in value" :key="index">
      <upload-one-image
        class="pull-left"
        :value="item"
        :enableRemove="enableRemove && index > 0"
        @change="(value) => handleChange(value, index)"
        @remove="() => handleRemove(index)"/>
    </div>
    <div class="uploader-wrapper pull-left">
      <upload-one-image
        v-if="!limit || (value && value.length < limit)"
        @change="(value) => handleChange(value)" />
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'
  import UploadOneImage from './UploadOneImage'

  export default {
    components: {
      UploadOneImage
    },
    props: {
      limit: Number,
      value: {
        // 和其他 input 类型一样, value 表示初始值
        type: Array,
        default () {
          return []
        }
      },
      enableRemove: {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    data () {
      return {
        pending: false,
        images: []
      }
    },
    mounted () {
      this.loadImages()
    },
    computed: {

    },
    watch: {
    },
    methods: {
      loadImages () {
        this.images = this.value || []
      },
      handleChange (data, index) {
        index = index === undefined ? this.images.length : index
        this.images[ index ] = data
        this.$emit('change', [...this.images])
      },
      handleRemove (index) {
        if(!index) return
        _.pullAt(this.images, [ index ])
        this.$emit('change', [...this.images])
      }
    }
  }
</script>

<style lang="scss">
  .uploader-wrapper {
    padding: 10px;
  }
</style>