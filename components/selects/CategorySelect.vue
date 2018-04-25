<template>
  <el-select placeholder="选择商品分类" multiple collapse-tags
             v-model="categoryIds" @change="handleChange">
    <el-option v-for="item in categoryOptions" :key="item.id" :label="item.title" :value="item.id">
      <span v-if="item.level == 1">{{ item.title }}</span>
      <span v-else-if="item.level == 2" style="margin-left: 2em;">{{ item.title }}</span>
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    value: {
      // 和其他 input 类型一样, value 表示初始值
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      categoryOptions: [],
      categoryIds: this.value ? _.map(this.value, (v) => +v) : []
    }
  },
  created () {
    this.fetchCategoryOptions()
  },
  computed: {},
  methods: {
    fetchCategoryOptions () {
      this.$store.dispatch('categories/list').then(() => {
        let categories = this.$store.state['categories'].data
        let options = []
        _.forEach(categories, (category) => {
          let item = _.pick(category, ['id', 'title'])
          item.level = 1
          options.push(item)
          _.forEach(category.children, (category) => {
            let item = _.pick(category, ['id', 'title'])
            item.level = 2
            options.push(item)
          })
        })
        this.$set(this, 'categoryOptions', options)
      })
    },
    handleChange (category_ids) {
      this.$emit('change', category_ids)
    }
  }
}
</script>
