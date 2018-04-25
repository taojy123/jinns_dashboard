<template>
  <div class="form-page">
    <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">
      <el-tab-pane label="订单信息" name="1" style="padding: 20px;">
        <el-card class="form-page__card" shadow="never" header="订单概况">
          <el-form label-position="left" inline class="order__summary">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="订单号">
                  <span>{{ order.data.order_number || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间">
                  <span>{{ order.data.created_at ? $moment(order.data.created_at) : ' - ' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收件人">
                  <span>{{ `${fulfillment_info.full_name} (${fulfillment_info.mobile})` }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收件地址">
                  <span>{{ fulfillment_info.address }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单状态">
                  <span>{{ orderStatusText }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支付状态">
                  <!-- <span>{{ financialStatusText }}</span> -->
                  <el-tag size="small" type="danger" v-if="order.data.is_refunding">正在退款</el-tag>
                  <el-tag size="small" type="warning" v-else-if="order.data.financial_status === 'pending'">待付款</el-tag>
                  <el-tag size="small" v-else-if="order.data.financial_status === 'partially_paid'">部分付款</el-tag>
                  <el-tag size="small" type="success" v-else-if="order.data.financial_status === 'paid'">已付款</el-tag>
                  <el-tag size="small" type="info" v-else-if="order.data.financial_status === 'refunded'">已退款</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <hr class="hr--light">
          <div class="order__transactions" v-if="order.data.transactions && order.data.transactions.length">
            <el-table class="order-detail__table" ref="transactionTable" tooltip-effect="dark"
                      :data="order.data.transactions" v-loading="order.pending">
              <el-table-column prop="transaction_number" label="交易号"></el-table-column>
              <el-table-column label="交易渠道">
                <template slot-scope="scope">
                  <span v-if="scope.row.channel === 'alipay'">支支付宝 APP 支付付宝</span>
                  <span v-else-if="scope.row.channel === 'alipay_pc_direct'">支付宝电脑网站支付</span>
                  <span v-else-if="scope.row.channel === 'alipay_qr'">支付宝扫码支付</span>
                  <span v-else-if="scope.row.channel === 'alipay_wap'">支付宝手机网页支付</span>
                  <span v-else-if="scope.row.channel === 'manual'">手动标记付款</span>
                  <span v-else-if="scope.row.channel === 'voucher'">礼品卡抵扣</span>
                  <span v-else-if="scope.row.channel === 'wx'">微信APP支付</span>
                  <span v-else-if="scope.row.channel === 'wx_lite'">微信小程序支付</span>
                  <span v-else-if="scope.row.channel === 'wx_pub'">微信公众号支付</span>
                  <span v-else-if="scope.row.channel === 'wx_pub_qr'">微信公众号扫码支付</span>
                  <span v-else-if="scope.row.channel === 'wx_wap'">微信WAP支付</span>
                </template>
              </el-table-column>
              <el-table-column label="交易类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.transaction_type === 'sale'">付款</span>
                  <span v-else-if="scope.row.transaction_type === 'refund'">退款</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="交易金额(元)"></el-table-column>
              <el-table-column label="交易状态" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status === 'success'" size="mini" type="success" >成功</el-tag>
                  <el-tag v-else-if="scope.row.status === 'pending'" size="mini" type="info" >进行中</el-tag>
                  <el-tag v-else-if="scope.row.status === 'failure'" size="mini" type="danger">失败</el-tag>
                  <el-tag v-else-if="scope.row.status === 'error'" size="mini" type="danger" >出错</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="交易时间">
                <template slot-scope="scope">
                  <span>{{ $moment(scope.row.created_at) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card class="form-page__card" shadow="never" header="订单详情">
          <el-table class="order-line__table" ref="orderLinesTable" tooltip-effect="dark"
                    :data="order.data.lines||[]" v-loading="order.pending">

            <el-table-column label="" width="80">
              <template slot-scope="scope">
                <img :src="(scope.row.image || 'https://global.heidiancdn.com/images/dashboard/default-image.png')|image(50,50)" width="50" height="50"/>
              </template>
            </el-table-column>
            <el-table-column prop="variant_title" label="产品标题" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.variant_title || ' - ' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SKU">
              <template slot-scope="scope">
                <span>{{ scope.row.variant && scope.row.variant.sku || 'SKU已失效' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="total_price" label="总价">
            </el-table-column>
          </el-table>
          <el-form class="product-price-wrapper">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-form-item label="备注" prop="note"></el-form-item>
                <el-form-item
                  v-for="(attribute, index) in order.data.variants"
                  :key="'attribute-'+index"
                  :label="attribute.id">{{ attribute.title }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="product-price__form-item" label="商品总价(元)">{{ order.data.total_line_items_price }}</el-form-item>
                <el-form-item class="product-price__form-item" label="运费(元)">{{ order.data.total_discounts }}</el-form-item>
                <el-form-item class="product-price__form-item" label="订单优惠(元)">
                  <el-tooltip :content="discount_string" v-if="discount_string">
                    <span>-￥{{  order.data.total_discounts }}</span>
                  </el-tooltip>
                  <span v-else>-￥{{  order.data.total_discounts }}</span>
                </el-form-item>
                <el-form-item class="product-price__form-item" label="修改价格(元)">
                  <span>￥{{+order.data.total_price == (+order.data.total_line_items_price + +order.data.shipping_cost - +order.data.total_discounts)?'--':order.data.total_price}}</span>
                </el-form-item>
                <el-form-item class="product-price__form-item" label="总价(元)">
                  <span>￥{{  order.data.total_price }}</span>
                </el-form-item>
                <el-form-item class="product-price__form-item" label="已支付(元)">
                  <span>￥{{  order.data.paid_price }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <div class="form-page__actions">
      <el-button type="primary" @click.prevent="markAsPaid"
        v-if="canMarkAsPaid"
        :disabled="order.data.pending" :loading="order.data.pending">标记付款</el-button>
    </div>
  </div>
</template>

<script>
import FormPage from '~/mixins/FormPage'
import SegmentSelect from '~/components/selects/SegmentSelect'

const storeName = 'order'
const formMixin = FormPage(storeName)

export default {
  head: { title: '订单详情' },
  meta: { title: '订单详情' },
  components: {},
  mixins: [formMixin],
  components: {
    SegmentSelect,
  },
  data () {
    let hash = this.$route.hash.slice(1)
    if (!/[1-3]/.test(hash)) {
      hash = '1'
      this.updateHash(hash)
    }
    return {
      storeName,
      activeTab: hash
    }
  },
  computed: {
    order_info (){
      var data = this.order
      return {
        customer_id: data.customer && data.customer.id || null,
        order_number: data.order_number || '-',
        requires_shipping: data.requires_shipping || false,
        created_at: this.$moment(data.created_at),
        updated_at: this.$moment(data.updated_at),
        paid_at: this.$moment(data.paid_at),
        fulfilled_at: this.$moment(data.fulfilled_at)
      }
    },
    account_info (){
      var customer = this.order.data && this.order.data.customer || {}
      return {
        full_name: customer.full_name || '-',
        mobile: customer.mobile || '-',
        email: customer.email || '-',
        group: customer.group || '-'
      }
    },
    fulfillment_info () {
      var data = this.order.data || {}
      if (data.requires_shipping && data.shipping_address) {
        // 如果 data.requires_shipping == true 并且 data.shipping_address 不存在, 订单数据有问题
        var shipping_address = data.shipping_address
        return {
          full_name: shipping_address.full_name || '-',
          mobile: shipping_address.mobile || '-',
          address: `${shipping_address.country} ${shipping_address.province} ${shipping_address.city} ${shipping_address.district} ${shipping_address.address1} ${shipping_address.address2}`
        }
      } else {
        return {
          full_name: data.full_name || '-',
          mobile: data.mobile || '-',
          email: data.email || '-'
        }
      }
    },
    orderStatusText () {
      const data = this.order.data || {}
      switch (data.order_status) {
        case 'open':
          return '进行中'
        case 'cancelled':
          return '已取消'
        case 'closed':
          return '已完成'
      }
    },
    financialStatusText () {
      const data = this.order.data || {}
      if (data.is_refunding) {
        return '正在退款'
      }
      switch (data.financial_status) {
        case 'pending':
          return '待支付'
        case 'paid':
          return '已支付'
        case 'partially_paid':
          return '部分付款'
        case 'refunded':
          return '已退款'
      }
    },
    discount_string () {
      if(_.isEmpty(this.order.data.discounts)) {
        return ''
      }else {
        return _.map(this.order.data.discounts, (item) => {
          return _.isEmpty(item.coupon_code) ? '' : `<p>使用优惠券 ${item.coupon_code.verbose_title} (${item.coupon_code.code})</p>`
        }).join('</br>')
      }
    },
    canMarkAsPaid () {
      return this.order.data.financial_status === 'pending' || this.order.data.financial_status === 'partially_paidpar'
    }
  },
  methods: {
    updateHash (name) {
      this.$router.replace(this.$route.fullPath.split('#')[0] + `#${name}`)
    },
    handleClickTab (tab, event) {
      this.updateHash(tab.name)
    },
    async markAsPaid () {
      try {
        const id = this.order.data && this.order.data.id || null
        if(!id) {
          this.$message.error('缺少参数')
          return
        }
        await this.$axios.post(`/orders/order/${id}/manually_marked_as_paid/`)
        this.$store.dispatch(`forms/${storeName}/retrieve`)
      } catch (err) {
        const err_msg = err.response && err.response.data.detail || '操作失败'
        this.$message.error(err_msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/stylesheets/core";
</style>
