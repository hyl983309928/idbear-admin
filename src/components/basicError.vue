<template>
<div class="error" v-if="show">
  {{errorMsg}}
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    errorMsg: {
      type: String,
      default: '出错了'
    }
  },
  computed: {},
  created () {},
  methods: {},
  watch: {}
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.error{
  color: $red;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
}
</style>
