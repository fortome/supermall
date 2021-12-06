<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  // 只要用default导出的才不用加{}

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop"

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debounce} from "common/utils";
  import {itemListenerMixin} from "common/mixin";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,

      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins:[itemListenerMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,

      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    // 组件创建完成发送网络请求
    created() {
      // 1.请求多个数据
      // this.getHomeMultidata() 调用methods里的getHomeMultidata()方法
      // getHomeMultidata() 是直接调用import {getHomeMultidata, getHomeGoods} from "network/home";导入的getHomeMultidata()方法
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    destroyed() {
      console.log('home destroyed');
    },
    // 当前页面活跃
    activated() {
      // console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      // 刷新一下scroll
      this.$refs.scroll.refresh()
    },
    // 离开当前页面时活跃
    deactivated() {
      // 1.保存Y值
      // console.log('deactivated');
      // 离开时记住页面的上拉的高度
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    mounted() {
      // 下面这些代码在src/common/mixin.js里面，已经被混入，可以在vuejs官网中查看什么是混入
      // 这个地方的img标签确实被挂载，但是其中的图片还没有占据高度
      // 3.图片加载完成的事件监听
      // this.$refs.scroll.refresh传的是函数，this.$refs.scroll.refresh()传的是这个函数的返回值
      // this.$refs.scroll.refresh对这个函数进行防抖操作
      // const refresh = debounce(this.$refs.scroll.refresh, 100)

      // 对监听的事件进行保存
      // this.itemImgListener = () => {
      //   // console.log('------');
      //   // this.$refs.scroll.refresh()
      //   refresh()
      // }
      // this.$bus.$on('itemImageLoad', this.itemImgListener)

    },
    methods: {
      /**
       * 事件监听相关方法
       * */

      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        // 让两个TabControl的currentIndex保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        // 拿到scroll组件对象：this.$refs.scroll
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        // console.log(position);
        // 1.判断BackTop是否显示
        this.isShowBackTop = ((-position.y) > 1000)

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
      },

      // 2.获取tabControl的offsetTop
      // 所有的组件都有一个属性$el: 用于获取组件中的元素
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求的相关方法
       * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }

  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: var(--color-background);

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

   /*position: sticky; 滑到某个地方（top: 44px）固定住, sticky:粘性的*/
  /*.tab-control {*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/

  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;

  }

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
