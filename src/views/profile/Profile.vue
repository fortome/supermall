<template>
 <div>
   <h2>我的</h2>
   <h2>{{counter()}}</h2>
 </div>
</template>

<script>
export default {
  name: "Profile",
  methods: {
    counter() {
      // return (178.00 * 10000 + 98.00 * 10000 + 29.98 * 10000 + 29.80 * 10000) / 10000
      return 178.00 + 98.00 + 29.98 + 29.80
    }
  }
}
</script>

<style scoped>

</style>
