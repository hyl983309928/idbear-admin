<template>
<div class="basic-num-scope-input">
  <input v-model="littleNum" @keyup="filterNumber" @blur="filterNumber" class="input-text el-input__inner" size="small" />
  <span class="input-separator">-</span>
  <input v-model="largeNum" @keyup="filterNumber" @blur="filterNumber" class="input-text el-input__inner" size="small" />
</div>
</template>

<script>
export default {
  components: {},
  mixins: [],
  data () {
    return {
      littleNum: '',
      largeNum: ''
    }
  },
  props: {
    scopeList: Array
  },
  computed: {
  },
  created () {},
  mounted () {},
  methods: {
    filterNumber (e) {
      // e.target.value = e.target.value.replace(/[^0-9-]+/, '')
      this.littleNum = this.littleNum.replace(/[^0-9-]+/, '')
    }
  },
  watch: {
    scopeList: {
      handler: function (val) {
        if (val && val.length >= 2) {
          this.littleNum = val[0]
          this.largeNum = val[1]
        }
      },
      deep: true,
      immediate: true
    },
    littleNum: function (val) {
      let scopeList = [this.littleNum, this.largeNum]
      this.$emit('update:scopeList', scopeList)
      this.$emit('change', scopeList)
    },
    largeNum: function (val) {
      let scopeList = [this.littleNum, this.largeNum]
      this.$emit('update:scopeList', scopeList)
      this.$emit('change', scopeList)
    }
  }
}
</script>

<style scoped lang="scss">
.basic-num-scope-input{
  .input-separator{
    display: inline-block;
    height: 100%;
    line-height: 32px;
    padding: 0 5px;
    margin: 0;
    text-align: center;
  }
  .input-text{
    width: 50px;
    padding: 0 5px;
    height: 32px;
    line-height: 32px !important;
  }
}
</style>
