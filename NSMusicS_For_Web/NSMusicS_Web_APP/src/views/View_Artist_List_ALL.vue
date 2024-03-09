<template>
  <DynamicScroller
    :items="generateItems(20000)"
    :key-field="'id'"
    :min-item-size="54"
    class="scroller"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          item.message,
        ]"
        :data-index="index"
      >
        <div class="grid-item">
          <div class="avatar">
            <img
              :src="item.avatar"
              :key="item.avatar"
              alt="avatar"
              class="image"
            >
          </div>
          <div class="text">{{ item.message }}</div>
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script>
export default {
  props: {
    items: Array,
  },
  methods: {
    generateItems(count) {
      const items = [];
      for (let i = 0; i < count; i++) {
        items.push({
          id: i,
          avatar: `path/to/avatar-${i}.png`,
          message: `Message ${i + 1}`,
        });
      }
      return items;
    },
  },
};
</script>

<style scoped>
.scroller {
  height: 100%;
}

.grid-item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.avatar {
  width: 50px;
  height: 50px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text {
  font-size: 16px;
  font-weight: bold;
}
</style>