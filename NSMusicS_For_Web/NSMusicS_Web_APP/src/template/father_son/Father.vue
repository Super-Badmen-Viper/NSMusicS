<template>
  <div>
    <Child :propRef="propRef" :propReactive="propReactive" @emitValue="getEmitValue" />

    <h3>Emit：</h3>
    <button @click="emitToChild">Emit给子组件</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Child from '../father_son/Child.vue';

// 父传子
const propRef = ref('我是父组件通过 Ref 定义的值');
const propReactive = { name: '我是父组件的通过 Reactive 定义的值', path: 'index' };
function emitToChild() {
  propRef.value = '父传子成功';
}

// 子传父
function getEmitValue(value: any) {
  console.log('(父组件)emit 的值', '(子组件)' + value);
}
</script>