<template>
    <div class="content">
    <!-- <navigation-panel /> -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import axiosInstanse from "@/services/axios.js";

axiosInstanse
      .get(`/entertainment_venues/search`, {name:'R'})
      .then((response) => {
        console.log(response.data);
        })
      .catch((error) => {
        console.log(response.data);
      });
</script>
