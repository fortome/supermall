<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
<!--      属性：topImages 传入值：top-images-->
<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList">{{item}}</li>-->
<!--      </ul>-->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";
  import Toast from "components/common/toast/Toast";

  import {getDetail,  getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";

  import { mapActions } from "vuex"

  export default {
    name: "Detail",
    components: {
      DetailSwiper,
      DetailNavBar,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop,
      // Toast,

      Scroll,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex: 0,
      }
    },
    created() {
      // 1.保存传入的iid
      // console.log(this.$route.params.iid);
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        // console.log(res);
        const data = res.result
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.保存评论信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0]
        }

        // 1.第一次获取，值不对
        // 值不对的原因：this.$refs.params.$el压根没有渲染
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);


        // this.$nextTick(() => {
        //   // 2.第二次获取：值不对
        //   // 值不对的原因：图片没有计算在内
        //   // 根据最新的数据，对应的DOM是已经被渲染出来
        //   // 但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
        //   // offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //   console.log(this.themeTopYs);
        // })

      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })

    },
    mounted() {
      console.log('mounted');
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()

        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeTopYs);
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },
      contentScroll(position) {
        // console.log(position);
        // 1.获取y值
        const positionY = -position.y
        // 2.positionY和主题中值进行对比
        let length = this.themeTopYs.length
        // 此时length=4

        // 方法一：
        for (let i = 0; i < length; i++) {

          //this.currentIndex !== i 用来避免重复执行if里面的内容，用到这个条件只执行一次了
          if (this.currentIndex !== i && (i < length-1 && positionY >= this.themeTopYs[i] && positionY <  this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[length-1])) {
            // console.log(i);
            this.currentIndex = i;
          //this.$refs.nav.currentIndex = this.currentIndex 与 this.$refs.nav.currentIndex = i 一样
            this.$refs.nav.currentIndex = i
          }
        }

        // 方法二
        // Number.MAX_VALUE为JS中最大的数
        // this.themeTopYs.push(Number.MAX_VALUE)
        // for (let i = 0; i < length-1; i++) {
        //   if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY <= this.themeTopYs[i+1])) {
        //     this.currentIndex = i;
        //     this.$refs.nav.currentIndex = this.currentIndex
        //   }
        // }

        // 3.判断BackTop是否显示
        this.listenShowBackTop(position)

      },
      addToCart() {
        // console.log('添加到购物车');
        // 1.获取购物车需要展示的信息
        // console.log(this)
        const product = {};
        product.iid = this.iid
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.nowPrice;

        // 2.将商品添加到购物车里(1.Promise 2.mapActions)
        // this.$store.commit('addCart', product)

        this.addCart(product).then(res => {
          // console.log(res);
          // this.show = true;
          // this.message = res;
          // setTimeout(() => {
          //   this.show = false;
          //   this.message = ''
          // }, 1500)

          console.log(this.$toast);
          this.$toast.show(res, 2000)
        })

        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);

        // })
      }

    }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    /* position: relative; 相对定位还是在原来的位置*/
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    /* 需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px)；*/
    /* height: calc(100% - 44px);这里面的100%是父元素大小 */
    /* height: calc(100% - 44px - 58px); 与 height: calc(100% - 102px);*/
    height: calc(100% - 44px - 58px);
  }
</style>
