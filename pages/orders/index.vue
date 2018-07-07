<template>
<div class="list-page">
  <div class="list-page__header clearfix">

      <el-input class="search-keyword" v-model="searchKeyword" @input="search" placeholder="搜索"></el-input>

      <el-radio-group class="search-status" @change="search" v-model="searchStatus">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="待支付"></el-radio-button>
        <el-radio-button label="已支付"></el-radio-button>
        <el-radio-button label="退款中"></el-radio-button>
        <el-radio-button label="已退款"></el-radio-button>
        <el-radio-button label="已取消"></el-radio-button>
      </el-radio-group>

  </div>
  <el-table tooltip-effect="dark" :data="orders.data" v-loading="orders.pending" style="width: 100%">
    <el-table-column prop="order_number" label="订单号" width="180"></el-table-column>
    <el-table-column prop="get_category_display" label="类型"></el-table-column>
    <el-table-column prop="title" label="内容" width="200"></el-table-column>
    <el-table-column prop="price" label="总价"></el-table-column>
    <el-table-column prop="full_name" label="姓名"></el-table-column>
    <el-table-column prop="mobile" label="手机" width="120"></el-table-column>
    <el-table-column prop="remark" label="备注"></el-table-column>
    <el-table-column prop="use_balance" label="余额支付"></el-table-column>
    <el-table-column prop="use_wx" label="微信支付"></el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-tag :type="statusTag(scope.row.status)" close-transition>{{scope.row.get_status_display}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
  <div class="text-center" :style="{padding:'20px'}">
    <el-pagination background layout="prev, pager, next"
                   :current-page="orders.page" @current-change="updatePage"
                   :page-size="orders.pageSize" :total="orders.count"></el-pagination>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'
import _ from 'lodash'

const storeName = 'orders'
const listMixin = ListPage(storeName)

export default {
  head: { title: '订单列表' },
  meta: { title: '订单列表' },
  components: {},
  mixins: [ listMixin ],
  data () {
    return {
      storeName,
      multipleSelection: [],
      searchKeyword: '',
      searchStatus: '',
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCreate () {
      this.$router.push('/orders/new')
    },
    handleEdit (index, row) {
      this.$router.push('/orders/' + row.id)
    },
    handleDelete (index, row) {
      this.removeOne(row.id)
    },
    statusTag(status){
      switch (status){
        case 'pending':
          return 'info'
        case 'paid':
          return 'success'
        case 'refunding':
          return 'warning'
        case 'refund':
          return 'warning'
        case 'cancel':
          return 'danger'
      }
    },
    search: _.debounce(
      function() {
        const filter = {}
        filter.keyword = this.searchKeyword
        const m = {
          '全部': 'pending',
          '待支付': 'paid',
          '已支付': 'refunding',
          '退款中': 'refund',
          '已退款': 'cancel',
        }
        filter.status = m[this.searchStatus]
        this.$store.dispatch('lists/orders/list', { filter })
      }, 500
    )
  }
}
</script>

<style>
  .search-keyword{
    max-width: 300px;
  }
  .search-status{
    margin-left: 20px;
  }

</style>
