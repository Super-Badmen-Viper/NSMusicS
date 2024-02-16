<script setup lang="ts">
  import { ref } from 'vue';
  
  const isCollapsed = ref(false);
  
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>
<template>
    <div class="sidebar">
        <button @click="toggleSidebar">Toggle Sidebar</button>
        <div :class="{ 'collapsed': isCollapsed }" class="menu">
            <!-- Your menu items go here -->
            <router-link to="/home">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/contact">Contact</router-link>
        </div>
    </div>
</template>
<style>
  .sidebar {
    position: relative;
    width: 200px;
    height: 600px;
    background-color: #f0f0f0;
  }
  
  .menu {
    transition: width 0.3s ease;
  }
  
  .collapsed {
    width: 60px;
  }
</style>
  