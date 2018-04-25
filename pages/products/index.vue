<template>
<div class="list-page">
  <div class="list-page__header clearfix">
    <el-button class="pull-right" type="primary" @click="handleCreate()">
      <i class="icon-add"></i>
      <span class="to-add">新增商品</span>
    </el-button>

    <transition :appear="false">
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
    </transition>
  </div>
  <el-table class="list-page__table" ref="multipleTable" tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            :data="products.data" v-loading="products.pending">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="图片">
      <template slot-scope="scope">
        <div class="img" :style="{backgroundImage: `url(${thumbnail(scope.row.image.src)})`}"></div>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="产品标题" show-overflow-tooltip></el-table-column>
    <el-table-column label="产品分类">
      <template slot-scope="scope">
        <span>{{ scope.row.category_titles.join(',') }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="price" label="价格"></el-table-column> -->
    <!-- <el-table-column prop="inventory_quantity" label="库存"></el-table-column> -->
    <el-table-column prop="created_at" label="创建时间">
      <template slot-scope="scope">
        <span>{{ $moment(scope.row.created_at, 'YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="published" label="发布状态" width="120">
      <template slot-scope="scope">
        <el-tag size="small" type="success" v-if="scope.row.published" disable-transitions>已发布</el-tag>
        <el-tag size="small" type="warning" v-else disable-transitions>未发布</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="actions" label="操作" width="160">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="text-center" :style="{padding:'20px'}">
    <el-pagination background layout="prev, pager, next"
                   :current-page="products.page" @current-change="updatePage"
                   :page-size="products.pageSize" :total="products.count"></el-pagination>
  </div>
</div>
</template>

<script>
import { getThumbnail } from '~/plugins/image/helper'
import CategorySelect from '~/components/selects/CategorySelect'
import ListPage from '~/mixins/ListPage'

const storeName = 'products'
const listMixin = ListPage(storeName)

export default {
  head: { title: '商品列表' },
  meta: { title: '商品列表' },
  components: {
    CategorySelect
  },
  mixins: [ listMixin ],
  asyncData (context) {
    /* 这里就是举一个例子, 因为 mixin 的 asyncData 不像 data 或者 methods 一样会被 merge
    覆盖了 asyncData 以后, 需要手动调用一下 listMixin 里面原来有的 asyncData */
    return listMixin.asyncData(context)
  },
  data () {
    return {
      storeName,
      multipleSelection: []
    }
  },
  computed: {},
  methods: {
    thumbnail: function (src) {
      return getThumbnail(60, 60, src)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCreate () {
      this.$router.push('/products/new')
    },
    handleEdit (index, row) {
      this.$router.push('/products/' + row.id)
    },
    handleDelete (index, row) {
      this.removeOne(row.id)
    },
    // published(id, value){
    //   this.update(id, {published: value}, this.fetchProductCount)
    // },
    // update(id, data, success, fail){
    //   if (this.$refs.list && this.$refs.list.deselect)this.$refs.list.deselect()
    //   this.$store.dispatch(`${this.storeName}/patch`, {
    //     id: id,
    //     data: data
    //   }).then((res)=> {
    //     this.refreshList()
    //     if (success)success()
    //   }, function () {
    //     if (fail)fail()
    //   })
    // },
    batch_published(value){
      this.batch_update({
        data: {published: value},
        success: () => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        },
        fail: () => {
          this.$message.error('操作失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.img {
  width: 60px;
  height: 60px;
  background-size: contain;
}
</style>
