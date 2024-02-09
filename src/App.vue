<template>
  <div class="content">
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavigationPanel from "@/components/NavigationPanel.vue";
import axiosInstance from "@/services/axios.js";
import "vue3-toastify/dist/index.css";
</script>
