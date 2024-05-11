<template>
    <div class="clickIcon">
      <div
        class="iconBox"
        :style="{ width: width + 'px', height: height + 'px' }">
        <slot name="svg" v-bind:data="{ toggle, flag, iconWidth, iconHeight }"></slot>
        <lottie
          @click="toggle"
          :class="{ show: flag === true || !defaultSlot }"
          class="like"
          style="display: none;"
          :options="options"
          :height="height"
          :width="width"
          v-on:animCreated="handleAnimation"
        />
      </div>
    </div>
</template>
<script>
import { computed, ref, defineComponent } from "vue";
import Lottie from "./Basic_Lottie.vue";
let anim = null
export default defineComponent({
    name: "clickIcon",
    props: {
      width: {
        type: Number,
        default: 100,
      },
      height: {
        type: Number,
        default: 100,
      },
      options: {
        type: Object,
        default: () => {},
      },
      // 是否需要一个插槽，显示一个默认的图标
      defaultSlot: {
        type: Boolean,
        default: true
      },
      // 从外面传递的一个点击后需要的交互效果
      toggleFun: {
        type: Function,
        default: null
      }
    },
    components: {
      lottie: Lottie,
    },
    emits: ['init'],
    setup(props, { emit }) {
      const animationSpeed = 2
      let flag = ref(false);
      const iconWidth = computed(() => {
        return props.width;
      });
      const iconHeight = computed(() => {
        return props.height;
      });
      const toggle = function() {
        if (!props.defaultSlot) {
          props.toggleFun && props.toggleFun(anim)
        } else {
          flag.value = !flag.value;
          if (flag.value) {
            anim.play();
          } else {
            anim.stop();
          }
        }
      };
      const handleAnimation = function(animated) {
        anim = animated;
        onSpeedChange()
        emit('init', animated)
      }
      const stop = function() {
        anim.stop();
      }
      const play = function() {
        anim.play();
      }
      const pause = function() {
        anim.pause();
      }
      const onSpeedChange = function() {
        anim.setSpeed(animationSpeed);
      }
      return {
        iconWidth,
        iconHeight,
        handleAnimation,
        flag,
        toggle,
        stop,
        play,
        pause
      };
    },
  });
  </script>
  
  <style scoped>
  .iconBox {
    position: relative;
  }
  .show {
    display: inline-block !important;
  }
  .hidden {
    display: none !important;
  }
  .like {
    cursor: pointer;
  }
  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>