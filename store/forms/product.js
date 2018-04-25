import FormStore from '~/mixins/store/Form'
// export default FormStore('/catalogue/product/')

const { state, getters, mutations, actions } = FormStore('/catalogue/product/')

export default {
  namespaced: true,
  state () {
    return {
      ...state()
    }
  },
  getters: {
    ...getters,
    getMetafield (state, getters) {
      return (namespace, key) => {
        const metafields = getters.getField('metafields', [])
        const metafield = _.find(metafields, { namespace, key })
        return _.get(metafield, 'value', '')
      }
    }
  },
  mutations: {
    ...mutations,
    reset (state, { id, data } = {}) {
      mutations.reset(state, { id, data })
      /* sort 一下确保 variant.options 的顺序和 this.options 一致 */
      const variants = _.map(state.data.variants, (variant) => {
        const predicate = (option) => _.findIndex(state.data.options, { title : option.title })
        const options = _.sortBy(variant.options, [predicate])
        return { ...variant, options }
      })
      state.data = { ...state.data, variants }
    },
    updateMetafield (state, { namespace, key, value }) {
      state.dirty = true
      const metafields = _.get(state.data, 'metafields', [])
      const metafield = _.find(metafields, { namespace, key })
      if (metafield) {
        metafield.value = value
      } else {
        metafields.push({ namespace, key, value })
      }
      state.data.metafields = [ ...metafields ]
    },
    addOption (state, { title, values }) {
      state.dirty = true
      const variants = _.map(state.data.variants, (variant) => {
        const options = [ ...variant.options, { title } ]
        return { ...variant, options }
      })
      const options = [ ...state.data.options, { title } ]
      state.data = { ...state.data, options, variants }
    },
    updateOption (state, { index, title }) {
      state.dirty = true
      _.forEach(state.data.variants, (variant) => {
        variant.options[index].title = title
      })
      state.data.options[index].title = title
      state.data = { ...state.data }
    },
    removeOption (state, { index }) {
      state.dirty = true
      const variants = _.map(state.data.variants, (variant) => {
        const options = _.filter(variant.options, (o, i) => (i !== index))
        return { ...variant, options }
      })
      const options = _.filter(state.data.options, (o, i) => (i !== index))
      state.data = { ...state.data, options, variants }
    },
    addVariant (state, { data }) {
      state.dirty = true
      data = _.cloneDeep(data || {})
      const options = _.map(state.options, ({ title }) => ({ title }))
      const newVariant = { options, ...data }
      const variants = [ ...state.data.variants, newVariant ]
      state.data = { ...state.data, variants }
    },
    removeVariant (state, { index }) {
      state.dirty = true
      const variants = _.filter(state.data.variants, (o, i) => (i !== index))
      state.data = { ...state.data, variants }
    }
  },
  actions: {
    ...actions
  }
}
