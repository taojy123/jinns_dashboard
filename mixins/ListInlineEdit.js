import _ from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'

import FormStore from '~/mixins/store/Form'
import ListStore from '~/mixins/store/List'

export default (propertyName, urlRoot) => {
  const nonce = parseInt(Math.random() * 899999 + 100000)
  const storeName = `${propertyName}_${nonce}`

  return {
    data () {
      return {
        storeName,
        initialValue: {},
        listFilter: {}
      }
    },
    mounted () {
      this.fetchItems()
    },
    created () {
      this.$store.registerModule(['lists', storeName], ListStore(urlRoot))
      this.$store.registerModule(['forms', storeName], FormStore(urlRoot))
    },
    destroyed () {
      this.$store.unregisterModule(['lists', storeName])
      this.$store.unregisterModule(['forms', storeName])
    },
    computed: {
      ...mapState(`lists/${storeName}`, {
        inlineItems (state) {
          /* 为了用 this 这里不能使用箭头函数 */
          let data = state.data
          if (this.editingItem.data.id === 'new') {
            data = data.concat([this.editingItem.data])
          }
          return { ...state, data }
        }
      }),
      ...mapState(`forms/${storeName}`, {
        editingItem: (state) => state
      })
    },
    methods: {
      ...mapActions(`lists/${storeName}`, ['list', 'remove' ]),
      ...mapActions(`forms/${storeName}`, [ 'save' ]),
      ...mapMutations(`forms/${storeName}`, [ 'updateField', 'reset' ]),
      async fetchItems (dispatch, payload) {
        await this.list({
          filter: this.listFilter,
          orderBy: 'created_at'
        })
      },
      async handleInlineDelete (id) {
        await this.$store.dispatch(`lists/${storeName}/remove`, { id })
        this.$message({ message: '删除成功', type: 'success' })
        await this.fetchItems()
      },
      async handleInlineSave () {
        await this.$store.dispatch(`forms/${storeName}/save`)
        this.$message({ message: '保存成功', type: 'success' })
        this.reset()
        await this.fetchItems()
        /* fetchItems() 要放在 reset 后面, 因为 fetchItems() 完了以后会重新渲染 table
        这时候 editingItem 还在, 所以会去异步触发里面的比如 ProductSelect 组件去获取数据
        这个时候 reset 同步执行了, 删掉了 editingItem 以至于 ProductSelect 也被删了
        然后 ProductSelect 数据获取以后, 他对应的组件和 store 都不存在了, 于是报错 */
      },
      handleInlineAdd () {
        let data = _.extend({ id: 'new' }, this.initialValue)
        this.reset({ data })
      },
      handleInlineEdit (data) {
        this.reset({ data })
      },
      handleInlineCancel () {
        this.reset()
      },
      handleInlineChange (path, value) {
        this.updateField({ path, value })
      }
    }
  }
}
