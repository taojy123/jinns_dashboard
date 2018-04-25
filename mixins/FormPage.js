import _ from 'lodash'
import { mapState, mapGetters, mapActions } from 'vuex'

import FormStore from '~/mixins/store/Form'

/*
Best practice:
FormPage 使用一个事先注册好的 store, 对于不是 FormPage 的表单,
比如一些 inline edit 控件, 需要新初始化一个 FormStore 使用一个随机的 store name
*/

export default (storeName, urlRoot) => {
  const propertyName = storeName
  return {
    asyncData ({ store, params }) {
      /* FormPage 加了个默认的 asyncData, 如果 page 引用了 formPageMixin 但是想覆盖 asyncData,
      可以定义一个自己的 asyncData (context), 然后调用 formPageMixin.asyncData(context) */
      // store.registerModule(['forms', storeName], FormStore(urlRoot))
      if (params.id === 'new') {
        store.commit(`forms/${storeName}/reset`)
      } else {
        store.commit(`forms/${storeName}/reset`, { id: params.id })
        return store.dispatch(`forms/${storeName}/retrieve`)
      }
    },
    computed: {
      ...mapState(`forms/${storeName}`, {
        [propertyName]: (state) => state
      }),
      ...mapGetters(`forms/${storeName}`, [
        'getField',
        'getError'
      ])
    },
    // created () {},
    // destroyed () {
    //   if (!this._KEEP_STORE) {
    //     this.$store.unregisterModule(['forms', storeName])
    //   }
    // },
    // filters: {
    //   error: function (value) {
    //     // make error text readable
    //     if (_.isArray(value)) {
    //       return value.join(', ')
    //     } else {
    //       return _.toString(value)
    //     }
    //   }
    // },
    methods: {
      updateField (path, value) {
        this.$store.commit(`forms/${storeName}/updateField`, { path, value })
      },
      submitForm () {
        return this.$store.dispatch(`forms/${storeName}/save`).then((data) => {
          this.$message({ message: '保存成功', type: 'success' })
          if (this.$route.params.id === 'new') {
            // this._KEEP_STORE = true
            let id = this[propertyName].id
            this.$router.replace(this.$route.path.replace(/new\/?$/, id))
          }
        }).catch((err) => {
          console.error('Form Error', err)
        })
      },
      resetForm () {
        this.$store.commit(`forms/${storeName}/reset`, {})
      }
    }
  }
}
