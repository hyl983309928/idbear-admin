<template>
  <li class="el-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="[paddingStyle, { backgroundColor }, itemStyle]"
    :class="{
      'is-active': active,
      'is-disabled': disabled
    }"
    @click="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <el-tooltip
      v-if="parentMenu.$options.componentName === 'ElMenu' && rootMenu.collapse && $slots.title"
      effect="dark"
      placement="right">
      <div slot="content"><slot name="title"></slot></div>
      <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;">
        <slot></slot>
      </div>
    </el-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>
<script>
/* eslint-disable */
  import Menu from './menu-mixin';
  import Emitter from './emitter';
  export default {
    name: 'ElMenuItem',

    componentName: 'ElMenuItem',

    mixins: [Menu, Emitter],


    props: {
      index: {
        type: String,
        required: true
      },
      route: [String, Object],
      disabled: Boolean
    },
    computed: {
      active() {
        // 手动修改，判断当前域名的第一级和传入的index的第一级是否相等，相等则高亮当前item
        let temp = this.$route.path.split('/')
        let temp1 = this.index.split('/')
        return temp[1] === temp1[1]
      },
      hoverBackground() {
        return this.rootMenu.hoverBackground;
      },
      backgroundColor() {
        // 当菜单选中时背景颜色修改为移入的背景颜色
        return this.active ? this.hoverBackground : this.rootMenu.backgroundColor
      },
      activeTextColor() {
        return this.rootMenu.activeTextColor || '';
      },
      textColor() {
        return this.rootMenu.textColor || '';
      },
      mode() {
        return this.rootMenu.mode;
      },
      itemStyle() {
        const style = {
          color: this.active ? this.activeTextColor : this.textColor
        };
        if (this.mode === 'horizontal' && !this.isNested) {
          style.borderBottomColor = this.active
            ? (this.rootMenu.activeTextColor ? this.activeTextColor : '')
            : 'transparent';
        }
        return style;
      },
      isNested() {
        return this.parentMenu !== this.rootMenu;
      }
    },
    methods: {
      onMouseEnter() {
        if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
        this.$el.style.backgroundColor = this.hoverBackground;
      },
      onMouseLeave() {
        if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return;
        this.$el.style.backgroundColor = this.backgroundColor;
      },
      handleClick() {
        if (!this.disabled) {
          this.dispatch('ElMenu', 'item-click', this);
          this.$emit('click', this);
        };
      }
    },
    created() {
      this.parentMenu.addItem(this);
      this.rootMenu.addItem(this);
    },
    beforeDestroy() {
      this.parentMenu.removeItem(this);
      this.rootMenu.removeItem(this);
    }
  };
</script>
