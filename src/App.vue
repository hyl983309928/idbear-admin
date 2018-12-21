<template>
  <div id="app" class="text-color-common">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created () {
  },
  computed: {
  }
}
</script>

<style lang="scss">
body{
}
#app {
  width: 100%;
  min-height: 100%;
  position: relative;
  background: #f2f2f2;
}
#nprogress .bar{
  background: #409EFF;
}
#nprogress .spinner-icon{
  border-top-color: #409EFF;
  border-left-color: #409EFF;
}
</style>
