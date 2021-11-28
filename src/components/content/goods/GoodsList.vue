<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item"/>
  </div>
</template>

<script>
  import GoodsListItem from "./GoodsListItem";

  export default {
    name: "GoodsList",
    components: {
      GoodsListItem
    },
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    /* flex-wrap默认是 nowrap不包裹，就会排成一行，而flex-wrap: wrap;是根据设置的孩子的宽度来包裹，就可以分行*/
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 2px;

  }

</style>
