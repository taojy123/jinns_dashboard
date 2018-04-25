import ListStore from '~/mixins/store/List'

const { state, getters, mutations, actions } = ListStore('/crm/segment/')

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
