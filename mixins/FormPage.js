import FormStore from '~/mixins/store/Form'
import _ from 'lodash'

export default (propertyName, urlRoot) => {
  return {
    asyncData ({ store, params }) {
      if (params.id === 'new') {
        const storeName = `CREATE_FORM_${propertyName}`
        const restModule = FormStore(urlRoot)
        restModule.namespaced = true
        store.registerModule(storeName, restModule)
        store.commit(`${storeName}/RETRIEVE_SUCCEEDED`, {})
        const payload = _.cloneDeep(store.state[storeName])
        return {
          isDirty: false,
          storeName: storeName,
          [propertyName]: payload
        }
      } else {
        const storeName = `UPDATE_FORM_${propertyName}`
        const restModule = FormStore(urlRoot)
        restModule.namespaced = true
        store.registerModule(storeName, restModule)
        return store.dispatch(`${storeName}/retrieve`, {
          id: params.id
        }).then((res) => {
          const payload = _.cloneDeep(store.state[storeName])
          return {
            isDirty: false,
            storeName: storeName,
            [propertyName]: payload
          }
        })
      }
    },
    computed: {
      isPending() {
        return this.$store.state[this.storeName].pending
      }
    },
    destroyed () {
      this.$store.unregisterModule(this.storeName)
    },
    watch: {
      [`${propertyName}.data`]: {
        handler (val) {
          this.isDirty = true
        },
        deep: true
      }
    },
    methods: {
      // changeField (value, field) {},
      submitForm (formName) {
        const storeName = this.storeName
        const updateProperty = () => {
          const payload = _.cloneDeep(this.$store.state[storeName])
          // this[propertyName] = payload
          this.$set(this, propertyName, payload)
        }
        if (this.$route.params.id === 'new') {
          return this.$store.dispatch(`${storeName}/create`, {
            data: this[propertyName]['data']
          }).then((data) => {
            updateProperty()
            this.$nextTick(() => { this.isDirty = false })
            this.$message({ message: '保存成功', type: 'success' })
            this.$router.replace(this.$route.path.replace(/new\/?$/, data.id))
          }).catch((err) => {
            updateProperty()
            console.error('Form Error', err)
          })
        } else {
          return this.$store.dispatch(`${storeName}/update`, {
            id: this.$route.params.id,
            data: this[propertyName]['data']
          }).then(() => {
            updateProperty()
            // updateProperty 会触发 watch [`${PROPERTY}.data`], 导致 isDirty 变成 true
            this.$nextTick(() => { this.isDirty = false })
            this.$message({ message: '保存成功', type: 'success' })
          }).catch((err) => {
            updateProperty()
            console.error('Form Error', err)
          })
        }
      },
      resetForm (formName) {}
    },
    filters: {
      error: function (value) {
        // make error text readable
        if (_.isArray(value)) {
          return value.join(', ')
        } else {
          return _.toString(value)
        }
      }
    }
  }
}
