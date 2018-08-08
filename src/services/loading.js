import Vue from 'vue'
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)

//显示
//Vue.$vux.loading.show()
// 隐藏
//Vue.$vux.loading.hide()
// 获取显示状态
//Vue.$vux.loading.isVisible() // true or false, v2.9.1 版本支持



let loading = Vue.$vux.loading;

function startLoading() {
  $(".page_box").addClass("disable-scroll");
  loading.show();
}

function endLoading() {
  $(".page_box").removeClass("disable-scroll");
  loading.hide()
}


let needLoadingRequestCount = 0

function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}


export default {
  showFullScreenLoading,
  tryHideFullScreenLoading,
}

