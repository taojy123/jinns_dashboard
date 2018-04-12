<template>
<div>
  <div class="sub-header well-box-m">
    <el-button type="primary" @click="handleCreate()">
      <i class="icon-add"></i>
      <span class="to-add">新增客房</span>
    </el-button>
  </div>
  <div class="well-box-s">
    <el-table tooltip-effect="dark" :data="rooms.data" v-loading="rooms.pending" style="width: 100%">
      <el-table-column prop="name" label="房型名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column prop="bed_type" label="床型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="bed_width" label="床宽"></el-table-column>
      <el-table-column prop="capacity" label="入住人数"></el-table-column>
      <el-table-column prop="floor" label="楼层"></el-table-column>
      <el-table-column prop="area" label="面积"></el-table-column>
      <el-table-column label="窗户">
        <template slot-scope="scope">
          <el-tag type="primary" close-transition>{{scope.row.window}}</el-tag>
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
                     :current-page="rooms.page" @current-change="updatePage"
                     :page-size="rooms.pageSize" :total="rooms.count"></el-pagination>
    </div>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'

const listMixin = ListPage('rooms', '/book/rooms/')

export default {
  head: { title: '客房列表' },
  meta: { title: '客房列表' },
  components: {},
  mixins: [listMixin],
  data () {
    return {}
  },
  methods: {
    handleCreate () {
      this.$router.push('/rooms/new')
    },
    handleEdit (index, row) {
      this.$router.push('/rooms/' + row.id)
    },
    handleDelete (index, row) {
      this.removeOne(row.id)
    }
  }
}
</script>
