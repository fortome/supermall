import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";

import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

import toast from "components/common/toast"

Vue.config.productionTip = false

// 给$bus添加一个 Vue实例
// Vue.prototype.方法=更改的内容 可以改变该方法的内容
// 添加事件总线对象
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)

// 使用懒加载的插件
Vue.use(VueLazyload,{
  loading: require('./assets/img/common/placeholder.png')
})

// 解决移动端300ms延迟
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')


// console.log('aaaa');
// setTimeout(() => {
//   console.log('bbbb');
// })
// console.log('cccc');

// aaaa -> cccc -> bbbb
