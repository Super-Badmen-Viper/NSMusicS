<script setup lang="ts">
import { ref, watch } from 'vue';

const { data } = defineProps<{ data: Media_File[]}>();
const data_temporary = ref<Media_File[]>(data.slice());// data.slice() BUG Error: Because Init

let bool_init = false
watch(data, () => {
  if (data.length != 0 && bool_init === false) {
    // 数据已经初始化完成，可以执行你想要的操作
    data_temporary.value = data.slice()
    bool_init = true
  }
  // const data_temporary = ref<Media_File[]>(data.slice());// data.slice() BUG Error: Because Init
  // data_temporary.value = data.slice(); //BUG Error
  // 会导致初始化data数据为空时被赋值，后续无法为其同步数据
  // 使用 watch(data, () => { if (data.length != 0 && bool_init === false){。。。。。}
  // 实现类似WPF 控件的 Loaded 触发事件
});
</script>