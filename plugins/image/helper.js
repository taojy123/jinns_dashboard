import _ from 'lodash'


export const getThumbnail = (width, height, url) => {
  if (!url) {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  }
  if (!/^(https|http):\/\/up\.img\.(heidian\.co|heidiancdn\.com)\//.test(url)) {
    return url;
  }
  var ratio = Math.ceil(window.devicePixelRatio || 1);
  var queries = [];
  var optimpath = url.split('?')[ 0 ];
  var match = url.match(/[?&](imageMogr2|imageView2)\/[^&]*/);
  if (match) {
    queries.push(match[ 0 ].slice(1));
  }
  if (!!height) {
    queries.push(`imageView2/1/w/${width * ratio}/h/${height * ratio}/ignore-error/1`);
  } else {
    queries.push(`imageView2/1/w/${width * ratio}/ignore-error/1`);
  }
  if (queries.length) {
    optimpath += '?' + queries.join('|');
  }
  return optimpath;
}

export const getOptimizeImage = (width, height, url) => {
  if (!url) {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  }
  if (!/^(https|http):\/\/up\.img\.(heidian\.co|heidiancdn\.com)\//.test(url)) {
    return url;
  }
  var ratio = Math.ceil(window.devicePixelRatio || 1);
  var queries = [];
  var optimpath = url.split('?')[ 0 ];
  var match = url.match(/[?&](imageMogr2|imageView2)\/[^&]*/);
  if (match) {
    queries.push(match[ 0 ].slice(1));
  }
  if (!!height) {
    queries.push(`imageView2/2/w/${width * ratio}/h/${height * ratio}/ignore-error/1`);
  } else {
    queries.push(`imageView2/2/w/${width * ratio}/ignore-error/1`);
  }
  if (queries.length) {
    optimpath += '?' + queries.join('|');
  }
  console.log(optimpath)
  return optimpath;
}

export function getVideoThumbnail(width, height, url){
  return url + (/^(.*)\?vframe\/jpg/.test(url) ? '|' : '?') + `vframe/jpg/offset/0/w/${width}/h/${height}`
}

export const getCleanUrl = (url) => {
  // return (/^(.*)\?(imageMogr2|imageView2).*?/.test(url)) ? RegExp.$1 : url
  return url.split('?')[0]
}

export function calculateImageUrl(metafield){
  var queries = [];
  var original_src = metafield.src;
  var url = original_src.split('?')[0];
  var match = original_src.match(/[?&](imageMogr2|imageView2)\/[^&]*/);
  if (match) {
    queries.push(match[0].slice(1));
  }
  if (metafield.crop) {
    var crop = _.cloneDeep(metafield.crop)
    _.each(['width', 'height', 'left', 'top'], function(key) {
      crop[key] = Math.round(crop[key]);
    });
    queries.push(`imageMogr2/crop/!${crop.width}x${crop.height}a${crop.left}a${crop.top}`)
  }
  if (metafield.quality) {
    queries.push(`imageMogr2/quality/${metafield.quality}`)
  }
  if (queries.length) {
    url += '?' + queries.join('|');
  }
  return url
}

export const getFileType = function(type){
  if(/image\/(\w+)/.test(type)){
    return 'image'
  }else if(/video\/(\w+)/.test(type)){
    return 'video'
  }else if(/audio\/(\w+)/.test(type)){
    return 'audio'
  }else{
    return 'other'
  }
}

export function getUUid(fileName) {
  var n = (new Date).getTime().toString(32), e = 0, i;
  var fileName = (fileName||'').replace(/[^\w\.]/g, '').slice(-10);
  for (i = 0; 5 > i; i++) n += Math.floor(65535 * Math.random()).toString(32);
  return ('o_') + n + (e++).toString(32) + fileName;
}

export function generate_code(length=8) {
  let len = length || 32;
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符 oOLl,9gq,Vv,Uu,I1****/
  let maxPos = chars.length;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
