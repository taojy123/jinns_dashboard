export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    return config
    const accessToken = store.state.auth.accessToken
    // console.log(config.url)
    if (/\/oauth\/dashboard\/token\/$/.test(config.url)) {
      return config
    } else if (accessToken) {
      config.headers.common['Authorization'] = `Bearer ${accessToken}`
      return config
    } else {
      redirect('/login')
      let error = new Error('Missing access token')
      error.response = {
        status: 401,
        config: config,
        data: { detail: 'Missing access token' }
      }
      return Promise.reject(error)
    }
  })
  $axios.onResponseError((error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      redirect('/login')
    }
  })
}
