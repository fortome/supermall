<template>
  <div class="cart">
<!--    导航-->
    <nav-bar class="nav-bar">
      <!--    <div class="nav-bar" slot="center">购物车({{$store.state.cartList.length}})</div>-->
<!--      <div slot="center">购物车({{cartLength}})</div>-->
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

<!--    商品列表-->
    <cart-list/>
<!--    底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";

  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      // 两种语法

      // 1.函数名一一映射
      // ...mapGetters(['cartLength', 'cartList'])
      // 2.自定义数名名称
      ...mapGetters({
        length: 'cartLength',
        list: 'cartList'
      })

    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

</style>
