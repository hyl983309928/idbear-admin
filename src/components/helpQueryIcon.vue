/**
* desc: 帮助的icon组件
* */
<template>
<div class="help-query-icon" @mouseleave="mouseleave" @mouseenter="mouseenter">
  <i class="iconfont icon-problem" v-popover:popover></i>
  <el-popover
    ref="popover"
    placement="right-start"
    :width="width"
    trigger="hover"
    :title="title"
    >
    <slot></slot>
  </el-popover>
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      showHelpContent: false
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 300
    }
  },
  computed: {},
  created () {},
  methods: {
    mouseleave () {
      this.showHelpContent = false
    },
    mouseenter () {
      this.showHelpContent = true
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.help-query-icon{
  display: inline-block;
  position: relative;
  line-height: 1;
  .icon-problem{
    cursor: pointer;
  }
  .help-query-content{
    position: absolute;
    padding: 15px;
    width: 200px;
    border-radius: 10px;
    top: -10px;
    left: 30px;
    border: 1px solid #e6e6e6;
    background: #fff;
    line-height: 1.5;
    &:after{
      content: '';
      position: absolute;
      top: 8px;
      left: -20px;
      border-width: 10px;
      border-style: dashed solid dashed dashed;
      border-color: transparent #e6e6e6 transparent transparent;
    }
    &:before{
      content: '';
      position: absolute;
      top: 8px;
      left: -19px;
      border-width: 10px;
      border-style: dashed solid dashed dashed;
      border-color: transparent #fff transparent transparent;
      z-index: 100;
    }
  }
}
</style>
