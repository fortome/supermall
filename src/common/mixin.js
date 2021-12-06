//混入的内容,可以混入的可以是生命周期函数，data(){},components(){}组件，methods{}方法
import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    // 这个地方的img标签确实被挂载，但是其中的图片还没有占据高度
    // 3.图片加载完成的事件监听
    // this.$refs.scroll.refresh传的是函数，this.$refs.scroll.refresh()传的是这个函数的返回值
    // this.$refs.scroll.refresh对这个函数进行防抖操作
    let refresh = debounce(this.$refs.scroll.refresh, 100)
    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    console.log('我是混入中的内容');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = ((-position.y) > 1000)
    }
  }
}
