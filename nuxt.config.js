module.exports = {
  /*
  ** No server-side rendering (only client-side navigation)
  */
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Jinns Dashboard',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Admin dashboard of MHD' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/admin/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  // loading: { color: '#3B8070' },
  // loading: false,
  loading: '~/components/loading.vue',
  /*
  ** Router
  */
  router: {
    base: '/admin/'
  },
  /*
  ** Plugins
  */
  plugins: [
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
    '~/plugins/axios',
    '~/plugins/element-ui',
    '~/plugins/forms',
    '~/plugins/config',
    '~/plugins/moment',
    '~/plugins/image/helper',
    '~/plugins/filters',
  ],
  /*
  ** Modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: process.env.API_URL || 'https://jinns.top', // use env API_URL to override
    browserBaseURL: process.env.API_URL_BROWSER || 'https://jinns.top', // use env API_URL_BROWSER to override
    credentials: false // cross-site Access-Control requests doesn't need to be made using credentials
  },
  /*
  ** Css
  */
  css: [
    // 'element-ui/lib/theme-chalk/index.css',
    { src: '~/assets/element-ui/index.scss', lang: 'scss' },
    { src: '~/assets/stylesheets/main.scss', lang: 'scss' }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: ['axios', 'element-ui'],
    extend (config, ctx) {
      if (ctx.isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      const bourbonIncludePaths = require('bourbon').includePaths
      config.module.rules.forEach((rule) => {
        // Get sass & scss loaders, put bourbon into includePaths
        if (['/\\.sass$/', '/\\.scss$/'].includes(rule.test.toString())) {
          // for scss files
          const loader = rule.use.pop()
          loader.options.includePaths = bourbonIncludePaths
          rule.use.push(loader)
        } else if (rule.loader === 'vue-loader') {
          // for <style lang="scss"> in .vue files
          const scssLoaders = rule.options.loaders.scss
          const loader = scssLoaders.pop()
          loader.options.includePaths = bourbonIncludePaths
          scssLoaders.push(loader)
        }
      })
    }
  }
}
