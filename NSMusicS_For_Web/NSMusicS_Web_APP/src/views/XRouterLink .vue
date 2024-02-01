<!--
支持外链的RouterLink, 只需要包装一次默认的router-link.
-->
<template>
  <!-- 以斜杠/开头的路径会被判定为内链, 否则是外链 你可以自己修改此逻辑 -->
  <a v-if="to.path && to.path[0] !== '/'" :href="to.path" :target="target">
    <slot></slot>
  </a>
  <router-link v-else v-bind="vProps">
    <slot></slot>
  </router-link>
</template>
<script>
  export default {
    name: 'XRouterLink',
    props: {
      to: {
        type: Object,
        default: {path: '/'},
        required: true,
      },
      target: {
        type: String,
        default: ''
      },
    },
    computed: {
      vProps() {
        // https://cn.vuejs.org/v2/api/#vm-attrs
        // 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。
        // 当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。
        return {...this.$props, ...this.$attrs}
      }
    },
  }
</script>