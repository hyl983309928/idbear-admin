<template>
<div class="add-emoji-component">
  <el-popover
    placement="bottom"
    width="300"
    trigger="click"
    v-model="show"
  >
    <div class="icon-box cursor-pointer" slot="reference" @click="show = !show">
      <i class="iconfont icon-biaoqing-xue icon"></i>
    </div>
    <div class="emoji-box">
      <div @click="submitEmoji(item)" class="emoji-item" v-for="(item, index) in emojiList" :key="index">
        <img :src="base64Emoji[item]" class="emoji-img cursor-pointer" />
      </div>
    </div>
  </el-popover>
</div>
</template>

<script>
import { base64Emoji, emojiList } from '../../lib/config/base64Emoji'
export default {
  components: {},
  data () {
    return {
      base64Emoji,
      emojiList,
      show: false
    }
  },
  computed: {},
  props: {
  },
  created () {
  },
  methods: {
    submitEmoji (key) {
      this.$emit('click-emoji', key)
      this.show = false
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
@import "@/style/variate.scss";
.add-emoji-component{
  display: inline-block;
  position: relative;
}
.icon-box{
  display: inline-box;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50% 50%;
  overflow: hidden;
  background: $yellow;
  text-align: center;
  vertical-align: top;
  .icon{
    font-size: 12px;
    color: #fff;
    vertical-align: top;
  }
}
  .emoji-box{
    max-height: 150px;
    overflow: auto;
    .emoji-item{
      display: inline-block;
      width: 30px;
      height: 30px;
      overflow: hidden;
      &:hover{
        background: #e8e8e8;
      }
      .emoji-img{
        width: 30px;
        height: 30px;
      }
    }
  }
</style>
