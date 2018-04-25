<template>
  <el-upload
    class="image-uploader"
    action="//upload.qiniup.com"
    accept="image/*"
    :multiple="false"
    :show-file-list="false"
    :http-request="uploadFile"
    :on-success="onUploadFileSuccess"
    :on-exceed="handleFileExceed"
    :before-upload="beforeFileUpload"
  >
    <div v-if="url" :style="imageStyle" class="uploader__img"></div>
    <i v-else class="el-icon-plus uploader__icon"></i>
  </el-upload>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'
  import { getThumbnail, getCleanUrl, calculateImageUrl } from '~/plugins/image/helper'
  import { qiniu } from '~/plugins/config'

  export default {
    props: {
      value: {
        // 和其他 input 类型一样, value 表示初始值
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        pending: false,
        image: null
      }
    },
    mounted () {
      this.loadImage()
    },
    computed: {
      imageStyle (){
        if (this.url) {
          return {
            backgroundImage: `url(${this.url})`
          }
        } else {
          return {}
        }
      },
      url (){
        if (this.image && this.image.src) {
          return this.image.src
        } else {
          return ''
        }
      },
    },
    watch: {
      value(val) {
        this.loadImage()
      }
    },
    methods: {
      loadImage(){
        if (this.value && this.value.src) {
          this.pending = true
          this.image = new Image()
          this.image.onload = this.loadImageComplete
          this.image.onerror = this.loadImageFailure
          this.image.src = this.getFormattedUrl(this.value.src)
        } else {
          this.image = null
        }
      },
      getFormattedUrl(url){
        return (/\.svg(\?.*)$/.test(url)) ? url : (getThumbnail(180, 180, url))
      },
      handleFileExceed(files, fileList) {
        this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      getUUid (file) {
        let curr = moment().format('YYYYMMDD').toString()
        let prefix = moment(file.lastModified).format('HHmmss').toString()
        let suffix = file.name
        let key = encodeURI(`${curr}_${prefix}_${suffix}`)
        return key
      },
      uploadFile (options) {
        let formData = new FormData()
        formData.append('token', qiniu.UPLOAD_TOKEN)
        formData.append('key', this.getUUid(options.file))
        formData.append('file', options.file)
        return this.$axios.post(options.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      },
      beforeFileUpload (file) {
        let curr = moment().format('YYYYMMDD').toString()
        let prefix = moment(file.lastModified).format('HHmmss').toString()
        let suffix = file.name
        let key = encodeURI(`${curr}-${prefix}_${suffix}`)
        // this.file_meta.size = file.size
        // this.file_meta.type = '_file_'
        // this.file_meta.name = file.name || ''
        if(!qiniu.UPLOAD_TOKEN) {
          this.$message.warning('缺少上传凭证，无法完成上传')
          return
        }else if(file.size >= qiniu.MAX_FILE_SIZE) {
          this.$message.error(`文件不得大于${(qiniu.MAX_FILE_SIZE || 1024 * 1024 * 20) / 1024 / 1024}MB`)
          return
        }
      },
      onUploadFileSuccess (res){
        let key = res.data.key || ''
        let url = `${qiniu.UPLOAD_DOMAIN}/${encodeURI(key)}`
        this.$emit('change', url)
        // let result = _.cloneDeep(this.value) || []
        // result[0].src = url
        // this.$emit('change', result)
      },
    }
  }
</script>

<style lang="scss">
  .image-uploader {
    .el-upload {
      border: 1px dashed #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      -webkit-transition: border-color .25s ease-in-out;
              transition: border-color .25s ease-in-out;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .uploader__icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .uploader__img {
      display: block;
      width: 178px;
      padding-top: 178px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
</style>