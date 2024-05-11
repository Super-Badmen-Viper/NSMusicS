<template>
    <lottie
      class="like"
      :options="defaultOptions"
      :height="height"
      :defaultSlot="false"
      :width="width"
      @init="init"
      :toggleFun="toggle"
      ref="lottie"
    >
    </lottie>
</template>
  
<script>
import Lottie from "./Button_Lottie.vue";
import animationData from "../../../resources/lottie_json/Animation - 1715318278722.json";
  
export default {
    name: "app",
    components: {
      lottie: Lottie,
    },
    props: {
      width: {
        type: Number,
        default: 60,
      },
      height: {
        type: Number,
        default: 60,
      },
    },
    methods: {
      init (animation) {
        animation && animation.goToAndStop(0, true)
      },
      toggle (animation) {
        if (this.toggleFlag) {
          animation.playSegments([50, 90], true); // 从50帧播放到最后
        } else {
          animation && animation.playSegments([0, 50], true); // 从第0帧播放到50帧
        }
        this.toggleFlag = !this.toggleFlag
      }
    },
    data() {
      return {
        toggleFlag: false,
        defaultOptions: {
          name: "like",
          animationData: animationData,
          autoplay: false,
          loop: false,
        }
      };
    }
  };
</script>
  
<style scoped>
  .hidden {
    display: none;
  }
</style>  