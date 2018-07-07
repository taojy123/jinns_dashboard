<template>
<div class="list-page">
  <div class="list-page__header clearfix">
  </div>
  <el-table tooltip-effect="dark" :data="customers.data" v-loading="customers.pending" style="width: 100%">
    <el-table-column label="">
      <img slot-scope="scope" :src="scope.row.headimgurl" height="50px">
    </el-table-column>
    <el-table-column prop="nickname" label="昵称"></el-table-column>
    <el-table-column prop="full_name" label="姓名"></el-table-column>
    <el-table-column prop="mobile" label="手机"></el-table-column>
    <el-table-column prop="balance" label="余额"></el-table-column>
    <el-table-column prop="points" label="积分"></el-table-column>
    <el-table-column prop="actions" label="操作" width="200">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="setBalance(scope.row.id)">余额调整</el-button>
        <el-button size="mini" type="success" @click="balanceDetail(scope.row.id)">余额明细</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="text-center" :style="{padding:'20px'}">
    <el-pagination background layout="prev, pager, next"
                   :current-page="customers.page" @current-change="updatePage"
                   :page-size="customers.pageSize" :total="customers.count"></el-pagination>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'

const storeName = 'customers'
const listMixin = ListPage(storeName)

export default {
  head: { title: '用户列表' },
  meta: { title: '用户列表' },
  components: {},
  mixins: [ listMixin ],
  data () {
    return {
      storeName,
      multipleSelection: []
    }
  },
  methods: {
    setBalance (customerId) {
      this.$prompt('请输入增加的金额（可填负数）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^-?\d+$/,
        inputErrorMessage: '请输入整数'
      }).then(({ value }) => {
        const url = `/api/shop/customers/${customerId}/set_balance/`
        const amount = value
        const reason = '手动调整'
        this.$axios.post(url, {amount, reason}).then(res => {
          this.$message.success('调整成功')
          this.refreshList()
        })
      })
    },
    balanceDetail (customerId) {
      this.$router.push(`/customers/${customerId}/balance_historys`)
    }
  }
}
</script>

