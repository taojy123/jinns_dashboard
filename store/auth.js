/*
如果没有设置初始值, 也就是 state = () => ({})
那第一次 setUser 或者 saveAccessToken 好像 Vue 检测不到变化,
于是不会触发更新的回路
*/
export const state = () => ({
  accessToken: null,
  user: {}
})

export const mutations = {
  saveAccessToken (state, accessToken) {
    state.accessToken = accessToken
    window.localStorage.setItem('access-token', accessToken)
  }
}

export const actions = {
  login ({ commit }, { email, password }) {
    const data = `username=${email}&password=${password}`
    const promise = this.$axios.post('/oauth/dashboard/token/', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    promise.then(function (res) {
      console.log('登录成功')
      commit('saveAccessToken', res.data.access_token)
    }, function (err) {
      console.log(err.response.data.detail || '登录失败')
      return Promise.reject(err.response.data)
    })
    return promise
  }
}
