<template lang="">
  <events-carousel :topEvents="topEvents" />
  <section class="premiere-movies">
    <div class="content-holder">
      <div id="film-holder-actual" class="film-box-holder">
        <div v-for="event in events.data">
          <event-box :event="event" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import EventBox from "@/components/EventBox.vue";
import EventsCarousel from "@/components/EventsCarousel.vue";
import {onMounted} from "vue";
import {useEventsStore} from "@/store/events.js";

const {events, topEvents, fetchEvents, fetchTopEvents} = useEventsStore();
onMounted(() => {
  fetchEvents();
  fetchTopEvents(4);
});
</script>
<style lang=""></style>
