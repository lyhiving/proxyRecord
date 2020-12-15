<template>
  <div id="app">
    <router-view :key="String(new Date())"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      activeDate:'123'
    }
  },
  mounted(){
    this.activeDate=new Date()
  }
}
</script>

<style lang="less">
@import "assets/less/index.less";
@import "assets/less/reset";
</style>
