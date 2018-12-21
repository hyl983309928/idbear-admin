<template>
    <div :style="circleSize" :class="wrapClasses">
        <svg viewBox="0 0 100 100">
            <path :d="pathString" :stroke="trailColor" :stroke-width="trailWidth" :fill-opacity="0" :style="trailStyle" />
            <path :d="pathString" :stroke-linecap="strokeLinecap" :stroke="strokeColor" :stroke-width="computedStrokeWidth" fill-opacity="0" :style="pathStyle" />
        </svg>
        <div :class="innerClasses" :style="{background: strokeColor}">
            <slot></slot>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
    const prefixCls = 'ivu-chart-circle';
    function oneOf (value, validList) {
      for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
          return true;
        }
      }
      return false;
    }

    export default {
        name: 'iCircle',
        props: {
            percent: {
                type: Number,
                default: 0
            },
            size: {
                type: Number,
                default: 120
            },
            strokeWidth: {
                type: Number,
                default: 4
            },
            strokeColor: {
                type: String,
                default: '#3d97f6'
            },
            strokeLinecap: {
                validator (value) {
                    return oneOf(value, ['square', 'round']);
                },
                default: 'round'
            },
            trailWidth: {
                type: Number,
                default: 5
            },
            trailColor: {
                type: String,
                default: '#eaeef2'
            },
            dashboard: {
                type: Boolean,
                default: false
            },
            isClockwise: {
              type: Boolean,
              default: true
            }
        },
        computed: {
            circleSize () {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`
                };
            },
            computedStrokeWidth () {
                return this.percent === 0 && this.dashboard ? 0 : this.strokeWidth;
            },
            radius () {
                return 50 - this.strokeWidth / 2;
            },
            pathString () {
                if (this.dashboard) {
                    return `M 50,50 m 0,${this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}`;
                } else {
                  if (this.isClockwise) {
                    return `M 50,50 m 0,-${this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`;
                  } else {
                    return `M 50,50 m 0,-${this.radius}
                    a ${this.radius},${this.radius} 0 1 0 0,${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 0 0,-${2 * this.radius}`;
                  }
                }
            },
            len () {
                return Math.PI * 2 * this.radius;
            },
            trailStyle () {
                let style = {};
                if (this.dashboard) {
                    style = {
                        'stroke-dasharray': `${this.len - 75}px ${this.len}px`,
                        'stroke-dashoffset': `-${75 / 2}px`,
                        'transition': 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
                    };
                }
                return style;
            },
            pathStyle () {
                let style = {};
                if (this.dashboard) {
                    style = {
                        'stroke-dasharray': `${(this.percent / 100) * (this.len - 75)}px ${this.len}px`,
                        'stroke-dashoffset': `-${75 / 2}px`,
                        'transition': 'stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s'
                    };
                } else {
                    style = {
                        'stroke-dasharray': `${this.len}px ${this.len}px`,
                        'stroke-dashoffset': `${((100 - this.percent) / 100 * this.len)}px`,
                        'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
                    };
                }
                return style;
            },
            wrapClasses () {
                return `${prefixCls}`;
            },
            innerClasses () {
                return `${prefixCls}-inner`;
            }
        }
    };
</script>

<style scoped>
  .ivu-chart-circle{
    position: relative;
    display: inline-block;
  }
  .ivu-chart-circle-inner {
    width: 85px;
    height: 85px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    line-height: 1;
    border-radius: 50% 50%;
    color: #fff;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
  }
</style>
