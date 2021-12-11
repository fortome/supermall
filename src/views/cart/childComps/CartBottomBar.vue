<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去结算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        // 乘整数倍排除误差，不乘在计算中会出现如100.0000000002的情况，这是因为精度的问题 如98.10 和 100.12计算
        // return preValue + item.price * item.count
        return (preValue  * 10000 + item.price * 10000 * item.count) / 10000

      }, 0)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      // 方法一：filter要全部遍历完
      // const num = 10; console.log(num) 为false 0！为true
      // 找出未被选的个数取反为false，就不是全选了
      // if (this.cartList.length === 0) return false
      // return !(this.cartList.filter(item => !item.checked).length)

      // 方法二：普通遍历
      // if (this.cartList.length === 0) return false
      // for (let item of this.cartList) {
      //   if (!item.checked){
      //     return false
      //   }
      // }
      // return true

      // 方法三：find找到第一个就返回
      // console.log(!undefined)
      // !undefined为true
      if (this.cartList.length === 0) return false
      return !this.cartList.find(item => !item.checked)

    }
  },
  methods: {
    checkClick() {
      //forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数。
      // 注意: forEach() 对于空数组是不会执行回调函数的。
      // if (this.isSelectAll){ //全部选中
      //   this.cartList.forEach(item => item.checked = false)
      // }else { //部分或全部不选中
      //   this.cartList.forEach(item => item.checked = true)
      // }

      // 以上代码简化
      let is_select_all = this.isSelectAll
      this.cartList.forEach(item => item.checked = !is_select_all)
    },
    calcClick() {
      // 只要有一件商品没选那就要提示，显然是不对的
      // if (!this.isSelectAll) {
      //   this.$toast.show('请选择购买的商品', 2000)
      // }

      // 只要有一个选中了那就不弹窗口, 过滤出来没有选的商品的个数与加入购物车里的商品数相同，就说明全没选，那就要提示，否则说明至少选了一件商品，那就不提示
      let no_select_all = this.cartList.filter(item => !item.checked).length;
      if (no_select_all === this.cartList.length) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;

    height: 40px;
    line-height: 40px;

    background-color: #eee;

    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
