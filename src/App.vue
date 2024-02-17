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
import {useAuthorizationStore} from "@/store/authorization.js";
import {useTicketsStore} from "@/store/tickets.js";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useCitiesStore} from "@/store/cities.js";

const {preferredCity, fetchCities} = useCitiesStore();

const {auth} = useAuthorizationStore();
const {user, isUserLoading} = storeToRefs(useAuthorizationStore());

onMounted(async () => {
  await fetchCities();
  await auth();
});
</script>
