import Vue from 'vue'

import { getThumbnail, getOptimizeImage } from '~/plugins/image/helper'

Vue.filter('image', function(value, width, height){
  return getThumbnail(width, height, value)
})

Vue.filter('optimize', function(value, width, height){
  return getOptimizeImage(width, height, value)
})