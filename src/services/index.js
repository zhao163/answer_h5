import myLoading from './loading'
import axios from 'axios'
// 'http://10.72.31.24:8065'
const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://bmweixin.tianrun.cn:8060' : 'http://bmweixin.tianrun.cn:8060'

// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

// 请求拦截器
axios.interceptors.request.use((config) => {
  if(config.config.showLoading){
    myLoading.showFullScreenLoading()
  }
  return config
}, (error) => {
  myLoading.showFullScreenLoading()
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use((response) => {
  if (response.config.config.showLoading) {
    myLoading.tryHideFullScreenLoading()
  }
  return response.data
}, (error) => {
  myLoading.tryHideFullScreenLoading()
  return Promise.reject(error)
})

//接口处理函数
function apiAxios (method, url, params, isJson, config) {
  isJson == undefined ? isJson = true : ''
  config == undefined ? config = {showLoading : true} : ''

  var headers = {};
  headers = isJson ? {'Content-Type': 'application/json;charset=utf-8'} : {'Content-Type': 'application/x-www-form-urlencoded'}
  params = isJson ? (params ? filterNull(params) : '') : (params ? $.param(params) : '')
  return axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: BASE_URL,
    config: config,
    headers: headers,
    withCredentials: true
  })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, isJson) {
    return apiAxios('GET', url, params, isJson)
  },
  post: function (url, params, isJson, config) {
    return apiAxios('POST', url, params, isJson, config)
  },
  put: function (url, params) {
    return apiAxios('PUT', url, params)
  },
  delete: function (url, params) {
    return apiAxios('DELETE', url, params)
  }
}
