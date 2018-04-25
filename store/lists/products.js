import ListStore from '~/mixins/store/List'
// export default ListStore('/catalogue/product/')

const { state, getters, mutations, actions } = ListStore('/catalogue/product/')

export default {
  namespaced: true,
  state () {
    return {
      ...state()
    }
  },
  getters: {
    ...getters
  },
  mutations: {
    ...mutations
  },
  actions: {
    ...actions
  }
}
