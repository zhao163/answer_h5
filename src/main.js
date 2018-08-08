import Vue from 'vue'
import App from './App'
import router from './router'
import constant from './constant/index'
import mixin from './mixins/index'
import $ from 'zepto'
import  { ConfirmPlugin } from 'vux'


// 300毫秒延迟
// import FastClick from 'fastclick'
// FastClick.attach(document.body)

Vue.mixin(mixin)

Vue.use(ConfirmPlugin)

// 将API方法绑定到全局
Vue.prototype.constant = constant

Vue.config.productionTip = false

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
