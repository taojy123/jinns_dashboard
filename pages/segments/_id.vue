<template>
  <div class="form-page">
    <el-tabs class="form-page__tabs" v-model="activeTab" @tab-click="handleClickTab">
      <el-tab-pane label="基本信息" name="1" style="padding: 20px;">
        <el-form label-position="top" :inline="false" :model="segment.data">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-card class="form-page__card" shadow="never">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-x-input-field label="分组标题" :storeName="storeName" name="title"></el-x-input-field>
                  </el-col>
                  <el-col :span="12">
                    <el-x-input-field label="分组描述" :storeName="storeName" name="description"></el-x-input-field>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="收货地址" :error="getMetafieldError('checkout', 'address')">
                      <el-input
                        :value="getMetafield('checkout', 'address')"
                        @change="(value) => updateMetafield('checkout', 'address', value)">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱后缀" :error="getMetafieldError('checkout', 'email_suffix')">
                      <el-input
                        :value="getMetafield('checkout', 'email_suffix')"
                        @change="(value) => updateMetafield('checkout', 'email_suffix', value)">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="24">
                    <el-form-item>
                      <el-button type="primary" @click.prevent="submitForm"
                        :disabled="!segment.dirty || segment.pending" :loading="segment.pending">提交</el-button>
                    </el-form-item>
                  </el-col> -->

                </el-row>

              </el-card>
            </el-col>
            <el-col :span="24">
              <el-card class="form-page__card" shadow="never">
                <el-table class="list-page__table" ref="multipleTable" tooltip-effect="dark"
                          :data="customers.data" v-loading="customers.pending"
                          @row-click="handleClickRow"
                          >
                  <el-table-column prop="full_name" label="客户名称" show-overflow-tooltip width="150"> </el-table-column>
                  <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
                  <el-table-column prop="gender" label="性别" width="100"></el-table-column>
                  <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="paid_orders" label="购买次数" width="100"></el-table-column>
                  <el-table-column prop="total_spent" label="消费金额" width="100"></el-table-column>
                  <el-table-column label="客户标签" width="150">
                    <template slot-scope="scope">
                      <el-tag v-for="tag in scope.row.tags" :type="tagType(tag)" :key="tag" close-transition class="table__cell__tag">{{tag}}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="text-center" :style="{padding:'20px'}">
                  <el-pagination background layout="prev, pager, next"
                                :current-page="customers.page" @current-change="updatePage"
                                :page-size="customers.pageSize" :total="customers.count"></el-pagination>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="form-page__actions">
      <el-button type="primary" @click.prevent="submitForm"
        :disabled="!segment.dirty || segment.pending" :loading="segment.pending">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import FormPage from '~/mixins/FormPage'
import SegmentSelect from '~/components/selects/SegmentSelect'

const storeName = 'segment'
const formMixin = FormPage(storeName)

export default {
  head: { title: '分组详情' },
  meta: { title: '分组详情' },
  components: {
    SegmentSelect,
  },
  mixins: [formMixin],
  asyncData ({ store, params }) {
    if (params.id === 'new') {
      const data = {

      }
      store.commit(`forms/${storeName}/reset`, { data })
    } else {
      store.commit(`forms/${storeName}/reset`, { id: params.id })
      return store.dispatch(`forms/${storeName}/retrieve`)
    }
  },
  data () {
    let hash = this.$route.hash.slice(1)
    if (!/[1-3]/.test(hash)) {
      hash = '1'
      this.updateHash(hash)
    }
    return {
      storeName,
      activeTab: hash,
      storeName2: 'customers',
    }
  },
  mounted () {
    this.$store.dispatch(`lists/${this.storeName2}/list`, {
      filter: {
        segment: this.segment.data.id
      }
    })
  },
  computed: {
    customers () {
      return this.$store.state.lists[ this.storeName2 ] || {}
    },
    ...mapGetters(`forms/${storeName}`, [
      'getMetafield'
    ])
  },
  methods: {
    handleClickRow (row) {
      row.id && this.$router.push(`/customers/${row.id}`)
    },
    updatePage (page) {
      this.$store.dispatch(`lists/${storeName2}/list`, {
        filter: {
          segment: this.segment.data.id,
          page: page
        }
      })
    },
    updateMetafield (namespace, key, value, value_type) {
      this.$store.commit(`forms/${storeName}/updateMetafield`, { namespace, key, value, value_type })
    },
    getMetafieldError () {
      return null
    },
    updateHash (name) {
      this.$router.replace(this.$route.fullPath.split('#')[0] + `#${name}`)
    },
    handleClickTab (tab, event) {
      // console.log(tab, event)
      this.updateHash(tab.name)
    },
    tagType (tag) {
      if (tag === '已有客户') {
        return 'primary'
      } else {
        return 'warning'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "assets/stylesheets/core";
.table__cell__tag + .table__cell__tag {
  margin-left: 5px;
}
</style>
