<template>
<div>
  <div class="sub-header well-box-m">
    <el-button type="primary" @click="handleCreate()">
      <i class="icon-add"></i>
      <span class="to-add">新增客户</span>
    </el-button>
  </div>
  <div class="well-box-s">
    <el-table ref="multipleTable" tooltip-effect="dark" style="width: 100%"
              :data="customers.data" v-loading="customers.pending"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="full_name" label="客户名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户标签" width="150">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :type="tagType(tag)" :key="tag" close-transition>{{tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="actions" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-center" :style="{padding:'20px'}">
      <el-pagination background layout="prev, pager, next"
                     :current-page="customers.page" @current-change="updatePage"
                     :page-size="customers.pageSize" :total="customers.count"></el-pagination>
    </div>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'

const listMixin = ListPage('customers', '/crm/customer/')

export default {
  head: { title: '客户列表' },
  meta: { title: '客户列表' },
  components: {},
  mixins: [listMixin],
  data () {
    return {}
  },
  methods: {
    tagType (tag) {
      if (tag === '已有客户') {
        return 'primary'
      } else {
        return 'warning'
      }
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
