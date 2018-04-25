import _ from 'lodash'

export default (urlRoot) => {
  if (!/\/$/.test(urlRoot)) urlRoot += '/'
  const url = (id) => (urlRoot + id + '/')

  const namespaced = true

  const state = () => ({
    filter: {},
    orderBy: null,
    page: 1,
    pageSize: 10,
    count: 0,
    data: [],
    error: {},
    pending: false
  })

  const getters = {}

  const mutations = {
    LIST_STARTED (state, { filter, page, pageSize, orderBy } = {}) {
      state.pending = true
      state.filter = (filter || {})
      state.page = (page || 1)
      state.pageSize = (pageSize || 10)
      state.orderBy = (orderBy || null)
    },
    LIST_SUCCEEDED (state, { count, data } = {}) {
      state.pending = false
      state.error = {}
      state.count = (count || 0)
      state.data = _.cloneDeep(data || [])
    },
    LIST_FAILED (state, { error } = {}) {
      state.pending = false
      state.error = _.cloneDeep(error || {})
    },
    REMOVE_STARTED (state) {
      state.pending = true
    },
    REMOVE_SUCCEEDED (state) {
      state.pending = false
    },
    REMOVE_FAILED (state, { error } = {}) {
      state.pending = false
      state.error = _.cloneDeep(error || {})
    },
    PATCH_STARTED (state) {
      state.pending = true
    },
    PATCH_SUCCEEDED (state) {
      state.pending = false
    },
    PATCH_FAILED (state, { error } = {}) {
      state.pending = false
      state.error = _.cloneDeep(error || {})
    }
  }

  const actions = {
    listNext () {},
    listPrev () {},
    list ({ commit }, { filter, page, pageSize, orderBy } = {}) {
      commit('LIST_STARTED', { filter, page, pageSize, orderBy })
      const extra = {}
      const params = _.clone(filter)
      if (page > 1) {
        extra.page = page
        params.page = page
      }
      if (pageSize) {
        extra.pageSize = pageSize
        params.page_size = pageSize
      }
      if (orderBy) {
        extra.orderBy = orderBy
        params.order_by = orderBy
      }
      const promise = this.$axios.get(urlRoot, { params: params })
      return promise.then((res) => {
        const data = res.data
        let payload = _.isArray(data) ? {
          count: data.length,
          data: data
        } : {
          count: data.count,
          data: data.results
        }
        payload = _.extend({}, extra, payload)
        commit('LIST_SUCCEEDED', payload)
        return payload
      }, (err) => {
        const error = err.response.data
        commit('LIST_FAILED', { error })
      })
    },
    patch ({ commit }, { id, data, options }) {
      commit('PATCH_STARTED')
      const request_url = id == null ? urlRoot : url(id)
      console.log(request_url, data, options, '===========')
      const promise = this.$axios.patch(request_url, data, options)
      return promise.then((res) => {
        commit('PATCH_SUCCEEDED')
        return {}
      }, (err) => {
        const error = err.response.data
        commit('PATCH_FAILED', { error })
        return Promise.reject(error)
      })
    },
    remove ({ commit }, { id }) {
      commit('REMOVE_STARTED')
      const promise = this.$axios.delete(url(id))
      return promise.then((res) => {
        commit('REMOVE_SUCCEEDED')
        return {}
      }, (err) => {
        const error = err.response.data
        commit('REMOVE_FAILED', { error })
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
