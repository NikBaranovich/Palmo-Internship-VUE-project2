<template lang="">
  <div></div>
</template>
<script setup>
import {useRoute, useRouter} from "vue-router";
import {useAuthorizationStore} from "@/store/authorization.js";
const {auth, signInWithGoogle} = useAuthorizationStore();
import {onMounted} from "vue";

import {ref} from "vue";
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await signInWithGoogle(route.query.token);
  router.push({path: `/`});
});
</script>
<style lang=""></style>
