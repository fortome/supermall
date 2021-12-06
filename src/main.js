import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";

Vue.config.productionTip = false

// 给$bus添加一个 Vue实例
// Vue.prototype.方法=更改的内容 可以改变该方法的内容
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


// console.log('aaaa');
// setTimeout(() => {
//   console.log('bbbb');
// })
// console.log('cccc');

// aaaa -> cccc -> bbbb
