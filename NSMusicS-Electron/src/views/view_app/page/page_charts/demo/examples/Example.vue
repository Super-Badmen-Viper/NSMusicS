<template>
  <h3 :id="id" style="text-align: center">
    <a style="font-weight: bold; font-size: 20px">
      {{ title }}
    </a>
    <br />
    <span v-if="desc" style="font-weight: bold; font-size: 15px">{{ desc }}</span>
  </h3>
  <section>
    <slot name="head" />
    <figure class="fig hero" v-if="!split">
      <slot />
    </figure>
    <div class="split" v-else>
      <figure class="fig half">
        <slot name="start" />
      </figure>
      <figure class="fig half">
        <slot name="end" />
      </figure>
    </div>
    <slot name="extra" />
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: String,
  split: Boolean,
})
</script>

<style>
.fig {
  display: flex;
  justify-content: center;
  width: fit-content;
  margin: 1em auto;

  .echarts {
    width: calc(70vw);
    height: 38vw;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 0 45px rgba(0, 0, 0, 0.2);
  }
}

.split {
  display: flex;
  justify-content: center;

  .fig {
    margin-right: 0;
    margin-left: 0;
  }
}

@media (max-width: 980px) {
  .fig {
    width: 100vw;
    margin: 1em auto;

    .echarts {
      width: 100%;
      min-width: 0;
      height: 60vw;
      border: none;
      border-radius: 0;
      box-shadow: none;
    }
  }
}

@media (min-width: 980px) {
  .fig.half {
    .echarts {
      width: 28vw;
      min-width: 240px;
      height: 180px;
    }

    & + & {
      margin-left: 30px;
    }
  }
}
</style>
