/*
如果没有设置初始值, 也就是 state = () => ({})
那第一次 setUser 或者 saveAccessToken 好像 Vue 检测不到变化,
于是不会触发更新的回路
*/
import { qiniu } from '~/plugins/config'

export const state = () => ({
  accessToken: null,
  user: {}
})

export const mutations = {
  saveAccessToken (state, accessToken) {
    state.accessToken = accessToken
    window.localStorage.setItem('access-token', accessToken)
  },
  clearAccessToken (state, accessToken) {
    state.accessToken = null
    window.localStorage.removeItem('access-token')
  },
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  login ({ commit, dispatch }, { email, password }) {
    const data = `username=${email}&password=${password}`
    const promise = this.$axios.post('/oauth/dashboard/token/', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    promise.then(function (res) {
      console.log('登录成功')
      commit('saveAccessToken', res.data.access_token)
      dispatch('user')
    }, function (err) {
      console.log(err.response.data.detail || '登录失败')
    })
    return promise
  },
  get_upload_token ({ commit }) {
    const promise = this.$axios.get(`/api/qiniu_token/${qiniu.BUCKET}/`, {
      params: {
        policy: {
          returnBody: '{\
              "name":$(fname),\
              "key":$(key),\
              "orientation":$(imageInfo.orientation),\
              "imageAve":$(imageAve),\
              "mimeType":$(mimeType),\
              "ext":$(ext),\
              "size":$(fsize),\
              "width":$(imageInfo.width),\
              "height":$(imageInfo.height)\
            }'
        }
      }
    })
    promise.then(qiniuRes => {
      qiniu.UPLOAD_TOKEN = qiniuRes.data && qiniuRes.data.uptoken || ''
    }, (err) => {
      const err_msg = err && err.response && err.response.data && err.response.data.detail || '未能获取qiniu信息'
      console.log(err_msg)
    })
    return promise
  },
  logout ({ commit }) {
    commit('clearAccessToken')
  },
  user ({ commit }) {
    this.$axios.get('/auth/').then((res) => {
      commit('setUser', res.data)
    }, (err) => {
      console.log(err.response.data.detail || '授权失败')
    })
  }
}
