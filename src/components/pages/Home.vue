<template lang="">
  <events-carousel :topEvents=topEvents />
  <section class="premiere-movies">
    <div class="content-holder">
      <div id="film-holder-actual" class="film-box-holder">
        <div v-for="event in events">
          <event-box
            :posterPath="
              'http://localhost:8080/storage/events/posters' + event.poster_path
            "
            :title="event.title"
            :id="event.id"
          />
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
  fetchTopEvents();
});
</script>
<style lang=""></style>
