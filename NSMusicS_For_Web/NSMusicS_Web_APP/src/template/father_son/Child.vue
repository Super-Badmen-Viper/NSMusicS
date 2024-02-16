<template>
  <div>
    <h2>子组件:</h2>
    <div>
      <h3>Props：</h3>
      <p>propRef：{{ propRef }}</p>
      <p>propReactive：{{ propReactive }}</p>
    </div>
    <div>
      <h3>Emit：</h3>
      <button @click="emitToParent">Emit给父组件</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// 父传子
// const { data } = defineProps<{ data: Media_File[] }>();
const { propRef, propReactive } = defineProps(['propRef', 'propReactive']);

// 子传父
const emit = defineEmits();
function emitToParent() {
  emit('emitValue', '我是子组件的emit，我被发射了');
}
</script>