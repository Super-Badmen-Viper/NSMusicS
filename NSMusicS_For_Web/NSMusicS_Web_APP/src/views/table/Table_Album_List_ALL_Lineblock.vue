<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  const props = defineProps(['data','collapsed','window_innerWidth']);
  const data_temporary = ref<Item_Album[]>(props.data.slice());// data.slice() BUG Error: Because Init

  // 重新渲染列表 width
  const collapsed_width = ref<number>(980)
  watch(() => props.collapsed, (newValue, oldValue) => {
    if (props.collapsed == true) {
      collapsed_width.value = window.innerWidth - 110;
    } else {
      collapsed_width.value = window.innerWidth - 220;
    }
  });
  let bool_watch = false;
  const timer = ref<NodeJS.Timeout | null>(null);//防止大量的重复渲染，造成界面假死
  const count = ref(0);
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  onMounted(() => {
    startTimer();
  });
  watch(() => props.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    if (props.collapsed == true) {
      collapsed_width.value = props.window_innerWidth - 110;
    } else {
      collapsed_width.value = props.window_innerWidth - 220;
    }
    if (bool_watch) {
      startTimer();
    }
  });
  //
  onMounted(() => {
    
  });
  let bool_init = false
  let bool_loading = true
  watch(props.data, () => {
    if (props.data.length != 0 && bool_init === false) {
      // 数据初始化完成操作
      data_temporary.value = props.data.slice()

      bool_init = true
      bool_loading = false

      if (props.collapsed == true) {
        collapsed_width.value = window.innerWidth - 110;
      } else {
        collapsed_width.value = window.innerWidth - 220;
      }
    }
  });

  const item_album = ref(200)
  const item_album_image = ref(180)
</script>
<template>
  <div class="table">
    <n-space>
      <n-space vertical 
        :style="{ width:item_album + 'px'}"
        v-for="(album, index) in data_temporary" 
        :key="index">
        <n-image
          :src="album.medium_image_url"
          :style="{ width:item_album_image + 'px',height:item_album_image + 'px'}"
          lazy>
          <template #placeholder>
            Loading
          </template>
        </n-image>
        <n-space vertical>
          <n-ellipsis>{{ album.name }}</n-ellipsis>
          <n-ellipsis>{{ album.artist }}</n-ellipsis>
          <n-ellipsis>{{ album.updated_at }}</n-ellipsis>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>
<style>
.table {
  height: calc(100vh - 200px);
}
</style>