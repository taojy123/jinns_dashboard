import Vue from 'vue'

const moment = require('moment')

Vue.prototype.$moment = function(val, format) {
  return moment(val).format(format || 'YYYY-MM-DD HH:mm')
}
