import FormStore from '~/mixins/store/Form'
// export default FormStore('/catalogue/product/')

const { state, getters, mutations, actions } = FormStore('/crm/segment/')

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
    updateMetafield (state, { namespace, key, value, value_type }) {
      value_type || (value_type = 'string')
      state.dirty = true
      const metafields = _.get(state.data, 'metafields', [])
      const metafield = _.find(metafields, { namespace, key })
      if (metafield) {
        metafield.value = value
        metafield.value_type = value_type
      } else {
        metafields.push({ namespace, key, value, value_type })
      }
      state.data.metafields = [ ...metafields ]
    }
  },
  actions: {
    ...actions
  }
}
