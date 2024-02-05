<template>
    <div class="content">
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavigationPanel from "@/components/NavigationPanel.vue";
import axiosInstanse from "@/services/axios.js";
import "vue3-toastify/dist/index.css";

// axiosInstanse
//       .get(`/entertainment_venues/search`, {name:'R'})
//       .then((response) => {
//         console.log(response.data);
//         })
//       .catch((error) => {
//         console.log(response.data);
//       });
</script>
