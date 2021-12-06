import Vue from "vue";
import Vuex from "vuex"

// 1.安装插件
Vue.use(Vuex)

// 2.创建Store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  // 修改state里面的内容用mutations
  mutations: {
    addCart(state, payload) {
      // payload新添加的商品
      // let oldProduct = null;
      // for (let item of state.cartList) {
      //   if (item.iid === payload.iid) {
      //     oldProduct = item;
      //   }
      // }
      // 1.查找之前数组中是否有该商品
      // let product = state.cartList.find(function (item) {
      //   return item.iid === payload.iid
      // })
      // 简写
      // find()函数用来查找目标元素，找到就返回该元素(item一条数据)，找不到返回undefined。
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)
      // 2.判断oldProduct
      if (oldProduct) {
        oldProduct.count += 1
      }else {
        payload.count = 1;
        state.cartList.push(payload)
      }

    }
  }
})

// 3.挂载Vue实例上
export default store
