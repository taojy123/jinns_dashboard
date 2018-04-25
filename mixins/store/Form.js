import _ from 'lodash'

/*
Best practice 关于命名, 只有全局的 mutation, getters 等等才大写, 别的都小写
It is a commonly seen pattern to use constants for mutation types in various Flux implementations.
This allows the code to take advantage of tooling like linters, and putting all constants in a single file
allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application.
*/

export default (urlRoot) => {
  if (!/\/$/.test(urlRoot)) urlRoot += '/'
  const url = (id) => (urlRoot + id + '/')

  const namespaced = true

  const state = () => ({
    id: null,
    data: {},
    error: {},
    dirty: false,
    pending: false
  })

  const getters = {
    getField (state) {
      return (path) => _.get(state.data, path)
    },
    getError (state) {
      return (path, stringify=true) => {
        const error = _.get(state.error, path)
        if (stringify && _.isArray(error)) {
          return error.join(', ')
        } else {
          return _.toString(error)
        }
      }
    }
  }

  const mutations = {
    updateField (state, { path, value }) {
      /* updateField 会导致 dirty, reset 不会 */
      state.dirty = true
      let data = _.set(state.data, path, value)
      state.data = { ...data }
    },
    reset (state, { id, data } = {}) {
      /* reset 会重置 dirty, reset 一般用于初始化或者请求结束以后重置数据 */
      state.dirty = false
      state.pending = false
      state.error = {}
      state.data = _.cloneDeep(data || {})
      state.id = +id || +state.data.id || null
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

  const actions = {
    retrieve ({ commit, state }) {
      if (!state.id) {
        throw new Error('Can\'t retrieve item without id')
      }
      commit('REQUEST_STARTED')
      const id = state.id
      const promise = this.$axios.get(url(id))
      return promise.then((res) => {
        const data = res.data
        commit('reset', { id, data })
        commit('REQUEST_SUCCEEDED')
        return data
      }, (err) => {
        const error = err.response.data
        commit('REQUEST_FAILED', { error })
      })
    },
    save ({ commit, state }, { partial, create } = {}) {
      commit('REQUEST_STARTED')
      let promise, id = state.id
      if (!id || create) {
        promise = this.$axios['post'](urlRoot, state.data)
      } else {
        let method = !partial ? 'put' : 'patch'
        promise = this.$axios[method](url(id), state.data)
      }
      return promise.then((res) => {
        const data = res.data
        if (data.id) id = data.id
        commit('reset', { id, data })
        commit('REQUEST_SUCCEEDED')
        return data
      }, (err) => {
        const error = err.response.data
        commit('REQUEST_FAILED', { error })
      })
    },
    remove ({ commit, state }) {
      if (!state.id) {
        throw new Error('Can\'t delete item without id')
      }
      commit('REQUEST_STARTED')
      const promise = this.$axios.delete(url(state.id))
      return promise.then((res) => {
        commit('REQUEST_SUCCEEDED')
        return {}
      }, (err) => {
        const error = err.response.data
        commit('REQUEST_FAILED', { error })
      })
    }
  }

  return {
    namespaced,
    state,
    getters,
    mutations,
    actions
  }

}
