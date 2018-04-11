export const actions = {
  nuxtClientInit ({ commit }) {
    if (!process.client) return
    const accessToken = window.localStorage.getItem('access-token')
    if (accessToken) {
      commit('auth/saveAccessToken', accessToken)
    }
  }
}
