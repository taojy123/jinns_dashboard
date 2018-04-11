import ListStore from '~/mixins/store/List'
import _ from 'lodash'

export default (propertyName, urlRoot) => {
  const storeName = `LIST_${propertyName}`
  const restModule = ListStore(urlRoot)
  restModule.namespaced = true

  return {
    data () {
      return {
        storeName: storeName
      }
    },
    asyncData ({ store, params, query }) {
      store.registerModule(storeName, restModule)
      const page = +query.page
      const pageSize = +query.page_size
      const orderBy = query.order_by
      const filter = _.omit(query, ['page', 'page_size', 'order_by'])
      return store.dispatch(`${storeName}/list`, { filter, page, pageSize, orderBy })
    },
    destroyed () {
      this.$store.unregisterModule(storeName)
    },
    computed: {
      isPending() {
        return this.$store.state[storeName].pending
      },
      [propertyName]: {
        get () {
          return this.$store.state[storeName]
        },
        set (value) {
          // this.$store.commit('updateMessage', value)
        }
      },
      pages () {
        const payload = this[propertyName]
        return (payload.count + payload.pageSize - 1) / payload.pageSize
      }
    },
    methods: {
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
        this.$store.dispatch(`${storeName}/list`, { filter, page, pageSize, orderBy })
      },
      updatePage (page) {
        const { filter, pageSize, orderBy } = (this[propertyName] || {})
        this._updateURL({ filter, page, pageSize, orderBy })
      },
      updatePageSize (pageSize) {
        const { filter, page, orderBy } = (this[propertyName] || {})
        this._updateURL({ filter, page, pageSize, orderBy })
      },
      updateOrderBy (orderBy) {
        const { filter, page, pageSize } = (this[propertyName] || {})
        this._updateURL({ filter, page, pageSize, orderBy })
      },
      updateFilter (filter, partial = false) {
        if (partial) {
          let originalFilter = _.cloneDeep(this.$store.state[storeName].filter)
          filter = _.extend(originalFilter, filter)
        }
        const { page, pageSize, orderBy } = (this[propertyName] || {})
        this._updateURL({ filter, page, pageSize, orderBy })
      },
      removeOne (id) {
        return this.$store.dispatch(`${storeName}/remove`, {
          id: id
        }).then(() => {
          const { filter, page, pageSize, orderBy } = (this[propertyName] || {})
          this.$store.dispatch(`${storeName}/list`, { filter, page, pageSize, orderBy })
        })
      }
    },
    filters: {}
  }
}
