<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendView",
  props: {
   recommends: {
     type: Array,
     default() {
       return []
     }
   }
  }
}
</script>

<style scoped>
  /* 水平布局 需要display: flex;  在设置flex: 1;里面的均等分*/
  .recommend {
    display: flex;
    width: 100%;
    text-align: center;
    font-size: 12px;

    /* padding: 上 右 下 左*/
    padding: 15px 0 20px;
    border-bottom: 10px solid #eee;
  }

   /*flex: 1; 均等分*/
  .recommend-item {
    flex: 1;
  }

  .recommend-item img {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
  }

</style>
