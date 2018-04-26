import _ from 'lodash'
import { mapState, mapGetters, mapActions } from 'vuex'

import ListStore from '~/mixins/store/List'

/*
Best practice:
ListPage 使用一个事先注册好的 store, 对于不是 ListPage 的列表,
比如一些 form 内部子列表控件, 需要新初始化一个 ListStore 使用一个随机的 store name
*/

export default (storeName, urlRoot) => {
  const propertyName = storeName
  return {
    // data () {
    //   return {
    //     storeName: storeName
    //   }
    // },
    asyncData ({ store, params, query }) {
      /* ListPage 加了个默认的 asyncData, 如果 page 引用了 listPageMixin 但是想覆盖 asyncData,
      可以定义一个自己的 asyncData (context), 然后调用 listPageMixin.asyncData(context) */
      // store.registerModule(['lists', storeName], ListStore(urlRoot))
      const page = +query.page
      const pageSize = +query.page_size
      const orderBy = query.order_by
      const filter = _.omit(query, ['page', 'page_size', 'order_by'])
      return store.dispatch(`lists/${storeName}/list`, { filter, page, pageSize, orderBy })
    },
    // destroyed () {
    //   this.$store.unregisterModule(['lists', storeName])
    // },
    computed: {
      ...mapState(`lists/${storeName}`, {
        [propertyName]: (state) => state
      }),
      pages () {
        const payload = this[propertyName]
        return parseInt((payload.count + payload.pageSize - 1) / payload.pageSize)
      }
    },
    methods: {
      refreshList () {
        const { filter, page, pageSize, orderBy } = (this[propertyName] || {})
        return this.$store.dispatch(`lists/${storeName}/list`, { filter, page, pageSize, orderBy })
      },
      batch_update({data, success, fail}){
        if (this.multipleSelection && this.multipleSelection.length) {
          var selected = _.map(this.multipleSelection, 'id').join(',')
          // if (this.$refs.list && this.$refs.list.deselect)this.$refs.list.deselect()
          this.$store.dispatch(`lists/${storeName}/patch`, {
            data: data,
            options: {
              headers: {'X-BULK-OPERATION': 'true'},
              params: {id__in: selected}
            }
          }).then((res)=> {
            this.multipleSelection = []
            this.refreshList()
            if (success)success()
          },()=>{
            if(fail)fail()
          })
        }
      },
      _updateURL ({ filter, page, pageSize, orderBy }) {
        page = page || 1
        pageSize = pageSize || 10
        let query = _.assign({}, filter, {
          page: page > 1 ? page : null,
          page_size: (pageSize > 0 && pageSize < 10) || pageSize > 10 ? pageSize : null,
          order_by: orderBy
        })
        const notEmpty = (v) => (!!v || v === 0 || v === false)
        query = _.pickBy(query || {}, (v) => notEmpty(v))
        const search = _.map(query, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&')
        this.$router.replace(this.$route.path + '?' + search)
        return this.$store.dispatch(`lists/${storeName}/list`, { filter, page, pageSize, orderBy })
      },
      updatePage (page) {
        const { filter, pageSize, orderBy } = (this[propertyName] || {})
        return this._updateURL({ filter, page, pageSize, orderBy })
      },
      updatePageSize (pageSize) {
        const { filter, page, orderBy } = (this[propertyName] || {})
        return this._updateURL({ filter, page, pageSize, orderBy })
      },
      updateOrderBy (orderBy) {
        const { filter, page, pageSize } = (this[propertyName] || {})
        return this._updateURL({ filter, page, pageSize, orderBy })
      },
      updateFilter (filter, partial = false) {
        if (partial) {
          let originalFilter = _.cloneDeep(this[propertyName].filter)
          filter = _.extend(originalFilter, filter)
        }
        const { page, pageSize, orderBy } = (this[propertyName] || {})
        return this._updateURL({ filter, page, pageSize, orderBy })
      },
      removeOne (id) {
        if(!confirm('确定删除？')){return}
        return this.$store.dispatch(`lists/${storeName}/remove`, {
          id: id
        }).then(() => {
          const { filter, page, pageSize, orderBy } = (this[propertyName] || {})
          this.$store.dispatch(`lists/${storeName}/list`, { filter, page, pageSize, orderBy })
        })
      }
    }
  }
}
