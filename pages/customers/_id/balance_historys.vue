<template>
<div class="list-page">
  <div class="list-page__header clearfix">
  </div>
  <el-table tooltip-effect="dark" :data="balance_historys.data" v-loading="balance_historys.pending" style="width: 100%">
    <el-table-column label="时间">
      <span slot-scope="scope">{{ showTime(scope.row.created_at) }}</span>
    </el-table-column>
    <el-table-column prop="amount" label="金额"></el-table-column>
    <el-table-column prop="reason" label="缘由"></el-table-column>
  </el-table>
  <div class="text-center" :style="{padding:'20px'}">
    <el-pagination background layout="prev, pager, next"
                   :current-page="balance_historys.page" @current-change="updatePage"
                   :page-size="balance_historys.pageSize" :total="balance_historys.count"></el-pagination>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'
import moment from 'moment'

const storeName = 'balance_historys'
const listMixin = ListPage(storeName)

export default {
  head: { title: '余额明细' },
  meta: { title: '余额明细' },
  components: {},
  mixins: [ listMixin ],
  data () {
    return {
      storeName,
      customerId: this.$route.params.id
    }
  },
  asyncData ({ store, params, query }) {
    query.customer = params.id
    listMixin.asyncData({ store, params, query })
  },
  methods: {
    showTime (t) {
      return moment(t).format('YYYY-MM-DD HH:mm:ss').toString()
    }
  }
}
</script>

