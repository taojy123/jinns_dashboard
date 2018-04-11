import _ from 'lodash'

export default (urlRoot) => {
  if (!/\/$/.test(urlRoot)) urlRoot += '/'
  const url = (id) => (urlRoot + id + '/')

  const state = () => ({
    data: {},
    error: {},
    pending: false
  })

  const mutations = {
    CREATE_STARTED (state, payload) {
      state.pending = true
      state.error = {}
      state.data = payload || {}
    },
    CREATE_SUCCEEDED (state, payload) {
      state.pending = false
      state.error = {}
      state.data = payload || {}
    },
    CREATE_FAILED (state, payload) {
      state.pending = false
      state.error = payload || {}
    },
    RETRIEVE_STARTED (state, payload) {
      state.pending = true
    },
    RETRIEVE_SUCCEEDED (state, payload) {
      state.pending = false
      state.error = {}
      state.data = payload || {}
    },
    RETRIEVE_FAILED (state, payload) {
      state.pending = false
      state.error = payload || {}
    },
    UPDATE_STARTED (state, payload) {
      state.pending = true
      state.error = {}
      state.data = payload || {}
    },
    UPDATE_SUCCEEDED (state, payload) {
      state.pending = false
      state.error = {}
      state.data = payload || {}
    },
    UPDATE_FAILED (state, payload) {
      state.pending = false
      state.error = payload || {}
    },
    REMOVE_STARTED (state, payload) {
      state.pending = true
    },
    REMOVE_SUCCEEDED (state, payload) {
      state.pending = false
      state.error = {}
      state.data = payload || {}
    },
    REMOVE_FAILED (state, payload) {
      state.pending = false
      state.error = payload || {}
    }
  }

  const actions = {
    create ({ commit }, { data }) {
      // data 是外部传进来的, 可能会被改变, 这里 clone 一下
      commit('CREATE_STARTED', _.cloneDeep(data))
      const promise = this.$axios.post(urlRoot, data)
      return promise.then((res) => {
        const payload = res.data
        commit('CREATE_SUCCEEDED', payload)
        return payload
      }, (err) => {
        const payload = err.response.data
        commit('CREATE_FAILED', payload)
        return Promise.reject(payload)
      })
    },
    retrieve ({ commit }, { id }) {
      commit('RETRIEVE_STARTED')
      const promise = this.$axios.get(url(id))
      return promise.then((res) => {
        const payload = res.data
        commit('RETRIEVE_SUCCEEDED', payload)
        return payload
      }, (err) => {
        const payload = err.response.data
        commit('RETRIEVE_FAILED', payload)
        return Promise.reject(payload)
      })
    },
    update ({ commit }, { id, data, partial }) {
      // TODO: 这里要优化一下, partial 的时候, data 不能作为 payload 直接传给 UPDATE_STARTED 和 UPDATE_SUCCEEDED
      // data 是外部传进来的, 可能会被改变, 这里 clone 一下
      commit('UPDATE_STARTED', _.cloneDeep(data))
      const method = partial ? 'patch' : 'put'
      const promise = this.$axios[method](url(id), data)
      return promise.then((res) => {
        const payload = res.data
        commit('UPDATE_SUCCEEDED', payload)
        return payload
      }, (err) => {
        const payload = err.response.data
        commit('UPDATE_FAILED', payload)
        return Promise.reject(payload)
      })
    },
    remove ({ commit }, { id }) {
      commit('REMOVE_STARTED')
      const promise = this.$axios.delete(url(id))
      return promise.then((res) => {
        const payload = res.data
        commit('REMOVE_SUCCEEDED', payload)
        return payload
      }, (err) => {
        const payload = err.response.data
        commit('REMOVE_FAILED', payload)
        return Promise.reject(payload)
      })
    }
  }

  return { state, mutations, actions }
}
