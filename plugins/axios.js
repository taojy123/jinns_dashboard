export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    const accessToken = store.state.auth.accessToken
    // console.log(config.url)
    /*
    ** 以下这段代码按需启用
    */
    // if (/\/oauth\/dashboard\/token\/$/.test(config.url)) {
    //   return config
    // } else if (accessToken) {
    //   config.headers.common['Authorization'] = `Bearer ${accessToken}`
    //   return config
    // } else {
    //   redirect('/login')
    //   return Promise.reject(new Error('Missing access token'))
    // }
  })
  $axios.onResponseError((error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      redirect('/login')
    }
  })
}
