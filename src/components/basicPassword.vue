<template>
<div>
  <el-input v-model="text" :placeholder="placeholder" :type="passwordHide ? 'password' : 'text'" @input="changeInput" @keydown="keydownEvent">
    <template slot="suffix">
      <div class="cursor-pointer" @click="passwordHide = !passwordHide">
        <i
          v-if="!passwordHide"
          class="iconfont icon-xianshimima text-color-minor"
          style="font-size: 18px;"
        >
        </i>
        <i
          v-else
          class="iconfont icon-yincangmima text-color-minor"
          style="font-size: 18px;">
        </i>
      </div>
    </template>
  </el-input>
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      passwordHide: true,
      text: this.value || ''
    }
  },
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '请输入密码'
    }
  },
  computed: {},
  created () {
  },
  methods: {
    keydownEvent (e) {
      this.$emit('keydown', e)
    },
    changeInput (value) {
      this.$emit('input', value)
    }
  },
  watch: {
    value: function (value) {
      this.text = value
    }
  }
}
</script>

<style scoped lang="scss">

</style>
