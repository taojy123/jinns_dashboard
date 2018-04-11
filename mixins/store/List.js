import _ from 'lodash'

export default (urlRoot) => {
  if (!/\/$/.test(urlRoot)) urlRoot += '/'
  const url = (id) => (urlRoot + id + '/')

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

  const mutations = {
    LIST_STARTED (state, { filter, page, pageSize, orderBy }) {
      state.pending = true
      state.filter = (filter || {})
      state.page = (page || 1)
      state.pageSize = (pageSize || 10)
      state.orderBy = (orderBy || null)
    },
    LIST_SUCCEEDED (state, { count, data }) {
      state.pending = false
      state.error = null
      state.count = (count || 0)
      state.data = (data || [])
    },
    LIST_FAILED (state, payload) {
      state.pending = false
      state.error = payload || {}
    },
    REMOVE_STARTED (state, payload) {
      state.pending = true
    },
    REMOVE_SUCCEEDED (state, payload) {
      state.pending = false
    },
    REMOVE_FAILED (state, payload) {
      state.pending = false
    }
  }

  const actions = {
    listNext () {},
    listPrev () {},
    list ({ commit }, { filter, page, pageSize, orderBy }) {
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
        return Promise.reject(err.response.data)
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
