import _ from 'lodash'

var urlRoot = '/catalogue/category/'
if (!/\/$/.test(urlRoot)) urlRoot += '/'

export const state = () => ({
  data: [],
  error: {},
  dirty: false,
  pending: false
})

export const mutations = {
  reset (state, { data } = {}) {
    /* reset 会重置 dirty, reset 一般用于初始化或者请求结束以后重置数据 */
    state.dirty = false
    state.pending = false
    state.error = {}
    state.data = _.cloneDeep(data || {})
  },
  updateField (state, { category, field, value }) {
    state.dirty = true
    category[field] = value
  },
  appendChild (state, { parentCategory }) {
    state.dirty = true
    if (!parentCategory.children) {
      parentCategory.children = []
    }
    parentCategory.children.push({ title: '新的分类' })
  },
  removeChild (state, { parentCategory, childCategory }) {
    state.dirty = true
    parentCategory.children = _.without(parentCategory.children, childCategory)
  },
  appendParent (state) {
    state.dirty = true
    state.data.push({ title: '新的分类', children: [] })
  },
  removeParent (state, { parentCategory }) {
    state.dirty = true
    state.data = _.without(state.data, parentCategory)
  },
  REQUEST_STARTED (state) {
    state.pending = true
    state.error = {}
  },
  REQUEST_SUCCEEDED (state) {
    state.pending = false
    state.error = {}
  },
  REQUEST_FAILED (state, { error } = {}) {
    state.pending = false
    state.error = _.cloneDeep(error || {})
  }
}

export const actions = {
  list ({ commit }) {
    commit('REQUEST_STARTED')
    const promise = this.$axios.get(urlRoot)
    return promise.then((res) => {
      const data = res.data
      commit('reset', { data })
      commit('REQUEST_SUCCEEDED')
      return data
    }, (err) => {
      const error = err.response.data
      commit('REQUEST_FAILED', { error })
    })
  },
  update ({ commit, state }) {
    commit('REQUEST_STARTED')
    const promise = this.$axios.put(urlRoot, state.data)
    return promise.then((res) => {
      const data = res.data
      commit('reset', { data })
      commit('REQUEST_SUCCEEDED')
      return data
    }, (err) => {
      const error = err.response.data
      commit('REQUEST_FAILED', { error })
    })
  }
}
