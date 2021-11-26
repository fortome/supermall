<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
  </div>
</template>

<script>
  // 只要用default导出的才不用加{}
  import NavBar from "components/common/navbar/NavBar";
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";

  import {getHomeMultidata} from "network/home";
  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView
    },
    data() {
      return {
        banners: [],
        recommends: []
      }
    },
    // 组件创建完成发送网络请求
    created() {
      // 1.请求多个数据
      getHomeMultidata().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    }

  }
</script>

<style scoped>
  .home-nav {
    background-color: var(--color-tint);
    color: var(--color-background)
  }
</style>
