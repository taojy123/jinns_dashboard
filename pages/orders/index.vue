<template>
<div class="list-page">
  <div class="list-page__header clearfix">
    <!-- <el-button class="pull-right" type="primary">
      <i class="icon-add"></i>
      <span class="to-add">新增订单</span>
    </el-button> -->

    <!-- <transition :appear="false">
      <div class="list-page__batch pull-left" v-show="multipleSelection.length >= 1">
        <div class="batch__item">
          <el-button @click.native="batch_mark" icon="icon-rmb-bold">批量标记付款</el-button>
        </div>
      </div>
    </transition> -->
    <transition :appear="false">
      <div class="list-page__filter pull-left" v-show="!multipleSelection.length">
        <div class="filter__item">
          <el-select clearable placeholder="选择发布状态"
                    :value="orders.filter.financial_status"
                    @change="(value) => updateFilter({financial_status: value}, true)">
            <el-option label="待付款" value="pending"></el-option>
            <el-option label="部分付款" value="partially_paid"></el-option>
            <el-option label="已付款" value="paid"></el-option>
          </el-select>
        </div>
      </div>
    </transition>
  </div>
  <el-table class="list-page__table orders-table" ref="multipleTable" tooltip-effect="dark"
            :data="orders.data" v-loading="orders.pending"
            :span-method="orderSpan"
            @selection-change="handleSelectionChange">
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="订单信息">
      <template slot-scope="scope">
        <div class="order-info">
          <span>订单号: {{scope.row.order_number}}</span>&nbsp;<span>创建时间: {{$moment(scope.row.created_at)}}</span>
        </div>
        <template v-if="scope.row.lines && scope.row.lines.length">
          <div class="order-product" v-for="p in scope.row.lines" :key="p.id">
            <div class="product-info">
              <img :src="(p.image || 'https://global.heidiancdn.com/images/dashboard/default-image.png')|image(50,50)" width="50" height="50"/>
              <span>{{p.title}}</span>
            </div>
            <div class="product-price">{{p.price}}</div>
            <div class="product-quantity">{{p.quantity}}</div>
          </div>
        </template>
        <div v-else class="order-product">
          <div class="product-info">
            <img :src="'https://global.heidiancdn.com/images/dashboard/default-image.png'|image(50,50)" width="50" height="50"/>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="单价(元)" width="80"></el-table-column>
    <el-table-column label="数量" width="80"></el-table-column>
    <el-table-column prop="total_price" label="总价(元)"></el-table-column>
    <el-table-column label="姓名">
      <template slot-scope="scope">
        <div>{{scope.row && scope.row.full_name}}</div>
        <div>{{scope.row && scope.row.mobile}}</div>
      </template>
    </el-table-column>
    <el-table-column label="交易状态" width="180">
      <template slot-scope="scope">
        <el-tag size="small" type="danger" v-if="scope.row.is_refunding">正在退款</el-tag>
        <el-tag size="small" type="warning" v-else-if="scope.row.financial_status === 'pending'">待付款</el-tag>
        <el-tag size="small" v-else-if="scope.row.financial_status === 'partially_paid'">部分付款</el-tag>
        <el-tag size="small" type="success" v-else-if="scope.row.financial_status === 'paid'">已付款</el-tag>
        <el-tag size="small" type="info" v-else-if="scope.row.financial_status === 'refunded'">已退款</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="actions" label="操作" width="180">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click.stop="handleEdit(scope.$index, scope.row)">查看</el-button>
        <!-- <el-tooltip content="查看" placement="top">

        </el-tooltip> -->

        <template v-if="scope.row.order_status === 'open'">
          <el-button
            size="mini" type="denager"
            v-if="scope.row.financial_status === 'pending' || scope.row.financial_status === 'partially_paid'"
            @click.stop="markAsPaid(scope.row && scope.row.id)">标记付款</el-button>
          <!-- <el-tooltip
            v-if="scope.row.financial_status === 'pending' || scope.row.financial_status === 'partially_paid'"
            content="标记付款" placement="top">
            <el-button size="mini" type="primary" icon="icon-rmb-bold" circle @click.stop="markAsPaid(scope.row && scope.row.id)"></el-button>
          </el-tooltip> -->
        </template>
        <template v-else-if="scope.row.order_status === 'closed'"></template>

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
      multipleSelection: []
    }
  },
  methods: {
    tagType (tag) {
      if (tag === '已有客户') {
        return 'primary'
      } else {
        return 'warning'
      }
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
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
    orderSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [1, 3]
      } else if (columnIndex === 1 || columnIndex === 2) {
        return [0, 0]
      }
    },
    orderStatusText (data) {
      switch (data.order_status) {
        case 'open':
          return '进行中'
        case 'cancelled':
          return '已取消'
        case 'closed':
          return '已完成'
      }
    },
    financialStatusText (data) {
      if (data.is_refunding) {
        return '正在退款'
      }
      switch (data.financial_status) {
        case 'pending':
          return '待付款'
        case 'paid':
          return '已付款'
        case 'partially_paid':
          return '部分付款'
        case 'refunded':
          return '已退款'
      }
    },
    async batch_mark (){
      this.$message.error('开发中...')
      // this.batch_update({
      //   // data: {published: this.multipleSelection},
      //   success: () => {
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success'
      //     })
      //   },
      //   fail: () => {
      //     this.$message.error('操作失败')
      //   }
      // })
    },
    async markAsPaid (id) {
      try {
        if(!id) {
          this.$message.error('缺少参数')
          return
        }
        await this.$axios.post(`/orders/order/${id}/manually_marked_as_paid/`)
        this.refreshList()
      } catch (err) {
        const err_msg = err.response && err.response.data.detail || '操作失败'
        this.$message.error(err_msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.orders-table {
  td .order-info {
    margin-left: 10px;
    margin-bottom: 5px;
    white-space: nowrap;
    word-break: normal;
    >span + span {
      display: inline-block;
    }
  }

  td .order-product {
    margin-left: 0px;
    display: flex;
  }

  td .product-info {
    margin-left: 10px;
    width: 300px;
    margin-bottom: 5px;
    img {
      margin-right: 10px;
      float: left;
    }
  }
  td .product-quantity,
  td .product-price {
    text-align: center;
    width: 80px;
  }
}
</style>
