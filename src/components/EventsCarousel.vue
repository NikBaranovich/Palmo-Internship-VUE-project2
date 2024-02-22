<template lang="">
  <div
    id="events-carousel"
    class="carousel slide"
    data-bs-ride="carousel"
    data-bs-interval="4000"
  >
    <div class="carousel-indicators">
      <button
        v-for="(event, index) in topEvents"
        :key="index"
        type="button"
        data-bs-target="#events-carousel"
        :data-bs-slide-to="index"
        :class="{active: index === 0}"
        :aria-current="index === 0 ? 'true' : null"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>
    <div class="carousel-inner">
      <div
        class="carousel-item"
        v-for="(event, index) in topEvents"
        :class="{active: index === 0}"
      >
        <a :href="'/films/' + event.id">
          <img
            :src="'http://localhost:8080/storage/' + event.backdrop_path"
            class="d-block w-100 parallax position-relative"
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ event.title }}</h5>
            <p>{{ event.overview }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineProps} from "vue";

const props = defineProps({
  topEvents: Array,
});
</script>
<style lang=""></style>
