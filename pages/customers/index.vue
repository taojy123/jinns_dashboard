<template>
<div class="list-page">
  <div class="list-page__header clearfix">
    <el-button class="pull-right" type="primary" @click="handleCreate()">
      <i class="icon-add"></i>
      <span class="to-add">新增客户</span>
    </el-button>

    <!-- <transition name="fade" :appear="false">
      <div class="list-page__batch pull-left" v-show="multipleSelection.length >= 1">
        <div class="batch__item">
          <el-button @click.native="batch_published(true)" icon="el-icon-upload2">批量发布</el-button>
        </div>
        <div class="batch__item">
          <el-button @click.native="batch_published(false)" icon="el-icon-download">批量下架</el-button>
        </div>
      </div>
    </transition>
    <transition name="fade" :appear="false">
      <div class="list-page__filter pull-left" v-show="!multipleSelection.length">
        <div class="filter__item">
          <category-select
            placeholder="选择商品分类"
            :value="products.filter.category__in ? products.filter.category__in.split(',') : []"
            @change="(values) => updateFilter({category__in: values.join(',')}, true)">
          </category-select>
        </div>
        <div class="filter__item">
          <el-select clearable placeholder="选择发布状态"
                    :value="products.filter.published"
                    @change="(value) => updateFilter({published: value}, true)">
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </div>
      </div>
    </transition> -->
  </div>
  <!--<filter-header/>-->
  <el-table class="list-page__table" ref="multipleTable" tooltip-effect="dark"
            :data="customers.data" v-loading="customers.pending"
            @selection-change="handleSelectionChange">
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="" width="10"></el-table-column>
    <el-table-column prop="full_name" label="客户名称" show-overflow-tooltip width="150"> - </el-table-column>
    <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
    <el-table-column prop="gender" label="性别" width="100">
      <template slot-scope="scope">
        <span v-if="scope.row.gender === 'male'">男</span>
        <span v-else-if="scope.row.gender === 'female'">女</span>
        <span v-else>未知</span>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
    <el-table-column prop="paid_orders" label="购买次数" width="100"></el-table-column>
    <el-table-column prop="total_spent" label="消费金额" width="100"></el-table-column>
    <el-table-column label="客户标签" width="150">
      <template slot-scope="scope">
        <el-tag v-for="tag in scope.row.tags" :type="tagType(tag)" :key="tag" size="mini" close-transition class="cell__tag">{{tag}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="actions" label="操作" width="160">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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

// import SubHeader from '~/components/header/SubHeader.vue'
// import FilterHeader from '~/components/header/FilterHeader.vue'

const storeName = 'customers'
const listMixin = ListPage(storeName)

export default {
  head: { title: '客户列表' },
  meta: { title: '客户列表' },
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
      this.$router.push('/customers/new')
    },
    handleEdit (index, row) {
      this.$router.push('/customers/' + row.id)
    },
    handleDelete (index, row) {
      this.removeOne(row.id)
    }
  }
}
</script>

<!--
tableData: [{
  name: '吕文兴（上海建设工程有限公司）',
  mobile: '15000157988',
  address: '上海市静安区泰兴路60号',
  tag: '潜在客户'
}, {
  name: '王强（上海一建工程有限公司）',
  mobile: '15000157988',
  address: '上海市杨浦区江浦路1100弄',
  tag: '已有客户'
}, {
  name: '李东来',
  mobile: '15000157988',
  address: '上海市杨浦区宁国路',
  tag: '已有客户'
}, {
  name: '孔军（上海材料装饰有限公司）',
  mobile: '15000157988',
  address: '上海市黄浦区新天地',
  tag: '已有客户'
}, {
  name: '刘长勇',
  mobile: '15000157988',
  address: '上海长宁区法华镇',
  tag: '已有客户'
}],
-->
