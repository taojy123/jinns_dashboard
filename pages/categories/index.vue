<template>
<div :style="{'maxWidth':'600px','margin':'20px auto'}">
  <el-tree
    class="categories-tree"
    :data="categories.data"
    :props="{'children':'children','label':'title'}"
    :indent="30"
    default-expand-all
    :expand-on-click-node="false"
    @node-click="handleNodeClick">
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <!-- <span>{{ node.label }}</span> -->
      <el-input :value="node.label" @change="(value) => changeField(data, 'title', value)"></el-input>
      <span v-if="node.level==1">
        <el-button
          type="text"
          size="mini"
          @click="() => appendChild(data)">
          增加子分类
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="() => removeParent(data)">
          删除
        </el-button>
      </span>
      <span v-else>
        <el-button
          type="text"
          size="mini"
          @click="() => removeChild(node.parent.data, data)">
          删除
        </el-button>
      </span>
    </span>
  </el-tree>
  <el-button
    type="text"
    @click="() => appendParent()">
    增加分类
  </el-button>
  <el-button type="primary" @click.prevent="saveCategories"
      :disabled="!isDirty || isPending" :loading="isPending">保存</el-button>
</div>
</template>

<script>
export default {
  head: { title: '商品分类' },
  meta: { title: '商品分类' },
  asyncData ({ store }) {
    return store.dispatch('categories/list')
  },
  data () {
    return {
      isPending: false,
      isDirty: true
    }
  },
  computed: {
    categories () {
      return this.$store.state['categories']
    }
  },
  methods: {
    handleNodeClick () {
      //
    },
    appendChild (parentCategory) {
      // data 是一个 level 1 category
      this.$store.commit('categories/appendChild', {
        parentCategory: parentCategory
      })
    },
    removeChild (parentCategory, childCategory) {
      this.$store.commit('categories/removeChild', {
        parentCategory: parentCategory,
        childCategory: childCategory
      })
    },
    appendParent () {
      this.$store.commit('categories/appendParent')
    },
    removeParent (parentCategory) {
      this.$store.commit('categories/removeParent', {
        parentCategory: parentCategory
      })
    },
    changeField (category, field, value) {
      this.$store.commit('categories/updateField', {
        category, field, value
      })
    },
    saveCategories () {
      return this.$store.dispatch('categories/update').then((data) => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    }
  }
}
</script>

<style lang="scss">
.categories-tree {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .el-input {
      width: 200px;
    }
  }
  .el-tree-node__content {
    height: 50px;
    &:hover {
      background-color: rgba(#000, 0);
    }
  }
}
</style>
