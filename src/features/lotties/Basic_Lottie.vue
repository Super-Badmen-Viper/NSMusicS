<template>
  <div :style="style" ref="lavContainer"></div>
</template>
<script>
  import lottie from 'lottie-web'
  
  export default {
    name: 'lottie',
    props: {
      options: {
        type: Object,
        required: true,
      },
      height: Number,
      width: Number,
    },
  
    computed: {
      style() {
        return {
          width: this.width ? `${this.width}px` : '100%',
          height: this.height ? `${this.height}px` : '100%',
        }
      },
    },
  
    mounted() {
      this.anim = lottie.loadAnimation({
        container: this.$refs.lavContainer,
        renderer: 'svg',
        loop: this.options.loop !== false,
        autoplay: this.options.autoplay !== false,
        animationData: this.options.animationData,
      })
      this.$emit('animCreated', this.anim)
    },
    
    unmounted () {
      this.anim && this.anim.destroy()
    }
  }
</script>  