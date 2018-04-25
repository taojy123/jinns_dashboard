<template>
<div class="list-page">
  <div class="list-page__header clearfix">
    <el-button class="pull-right" type="primary" @click="handleCreate()">
      <i class="icon-add"></i>
      <span class="to-add">新增分组</span>
    </el-button>

    <!-- <transition :appear="false">
      <div class="list-page__batch pull-left" v-show="multipleSelection.length >= 1">
        <div class="batch__item">
          <el-button @click.native="batch_published(true)" icon="el-icon-upload2">批量发布</el-button>
        </div>
        <div class="batch__item">
          <el-button @click.native="batch_published(false)" icon="el-icon-download">批量下架</el-button>
        </div>
      </div>
    </transition>
    <transition :appear="false">
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
            :data="segments.data" v-loading="segments.pending"
            @selection-change="handleSelectionChange">
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="" width="10"></el-table-column>
    <el-table-column prop="title" label="群组名称" width="200"> </el-table-column>
    <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
    <el-table-column prop="customers_count" label="群组成员" width="100"></el-table-column>
    <el-table-column label="创建时间" width="200">
      <template slot-scope="scope">
        <span>{{ $moment(scope.row.created_at, 'YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="actions" label="操作" width="160">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="text-center" :style="{padding:'20px'}">
    <el-pagination background layout="prev, pager, next"
                   :current-page="segments.page" @current-change="updatePage"
                   :page-size="segments.pageSize" :total="segments.count"></el-pagination>
  </div>
</div>
</template>

<script>
import ListPage from '~/mixins/ListPage'

// import SubHeader from '~/components/header/SubHeader.vue'
// import FilterHeader from '~/components/header/FilterHeader.vue'

const storeName = 'segments'
const listMixin = ListPage(storeName)

export default {
  head: { title: '分组列表' },
  meta: { title: '分组列表' },
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
      this.$router.push('/segments/new')
    },
    handleEdit (index, row) {
      this.$router.push('/segments/' + row.id)
    },
    handleDelete (index, row) {
      this.removeOne(row.id)
    }
  }
}
</script>
