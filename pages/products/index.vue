<template>
<div class="list-page">
  <div class="list-page__header clearfix">
    <el-button class="pull-right" type="primary" @click="handleCreate()">
      <i class="icon-add"></i>
      <span class="to-add">新增商品</span>
    </el-button>

  </div>
  <el-table tooltip-effect="dark" :data="products.data" v-loading="products.pending" style="width: 100%">
    <el-table-column prop="name" label="商品名称"></el-table-column>
    <el-table-column prop="price" label="价格"></el-table-column>
    <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
    <el-table-column prop="actions" label="操作" width="160">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="text-center" :style="{padding:'20px'}">
    <el-pagination background layout="prev, pager, next"
                   :current-page="products.page" @current-change="updatePage"
                   :page-size="products.pageSize" :total="products.count"></el-pagination>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'

const storeName = 'products'
const listMixin = ListPage(storeName)

export default {
  head: { title: '商品列表' },
  meta: { title: '商品列表' },
  components: {},
  mixins: [ listMixin ],
  data () {
    return {
      storeName,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCreate () {
      this.$router.push('/products/new')
    },
    handleEdit (index, row) {
      this.$router.push('/products/' + row.id)
    },
    handleDelete (index, row) {
      this.removeOne(row.id)
    }
  }
}
</script>

