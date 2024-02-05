<template lang="">
  <div class="film-content">
    <div class="filter-block">
      <div class="datepicker-block">
        <span class="p-float-label" style="width: 200px; display: inline-block">
          <Calendar
            v-model="date"
            id="start_date"
            :minDate="minDate"
            :maxDate="maxDate"
            :manualInput="false"
            :showIcon="true"
          />
          <label for="start_date">Choose event date</label>
        </span>
        <span
          class="p-float-label w-full md:w-20rem"
          style="width: 200px; display: inline-block"
        >
          <MultiSelect
            id="ms-cities"
            v-model="selectedVenues"
            :options="venues"
            optionLabel="name"
            :maxSelectedLabels="3"
            style="width: 200px"
            class="w-full"
          />
          <label for="ms-cities">Select Venues</label>
        </span>
        <span
          class="p-float-label w-full md:w-20rem"
          style="width: 200px; display: inline-block"
        >
          <MultiSelect
            id="ms-cities"
            v-model="selectedGenres"
            :options="eventGenres"
            optionLabel="name"
            :maxSelectedLabels="3"
            style="width: 200px"
            class="w-full"
          />
          <label for="ms-cities">Select Genres</label>
        </span>
        <div
          class="p-float-label w-full md:w-14rem"
          style="width: 200px; display: inline-block"
        >
          <Dropdown
            v-model="selectedCity"
            inputId="dd-city"
            :options="venues"
            optionLabel="name"
            class="w-full"
          />
          <label for="dd-city">Select a City</label>
        </div>
        <button @click="filterEvents">Filter</button>
      </div>
    </div>
    <div class="film-list">
      <ul v-for="event in events">
        <EventListItem :event="event"/>
      </ul>
      <!-- <div >
        <event-box
          :posterPath="
            'http://localhost:8080/storage/events/posters' + event.poster_path
          "
          :title="event.title"
          :id="event.id"
        />
      </div> -->
    </div>
  </div>
</template>
<script setup>
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import EventListItem from "../EventListItem.vue";
import {ref} from "vue";

const date = ref();
const selectedVenues = ref();
const selectedGenres = ref();
const minDate = ref(new Date());
const maxDate = ref(new Date());

minDate.value.setDate(minDate.value.getDate() - 14);

import EventBox from "@/components/EventBox.vue";
import EventsCarousel from "@/components/EventsCarousel.vue";
import {onMounted} from "vue";
import {useEventsStore} from "@/store/events.js";
import {useVenuesStore} from "@/store/venues.js";
const {venues, fetchVenues} = useVenuesStore();
const {events, topEvents,eventGenres, fetchEvents, fetchFilteredEvents,fetchEventGenres} = useEventsStore();
onMounted(() => {
  fetchEvents();
  fetchVenues();
  fetchEventGenres();
});

const cities = ref([
  {name: "New York", code: "NY"},
  {name: "Rome", code: "RM"},
  {name: "London", code: "LDN"},
  {name: "Istanbul", code: "IST"},
  {name: "Paris", code: "PRS"},
]);

const filterEvents = () => {
    fetchFilteredEvents(date.value, selectedVenues.value);
};
</script>
<style scoped>
.film-content {
  padding-top: 40px;
  width: 900px;
  margin: 0 auto;
  background-color: white;
}

.filter-block {
  width: 100%;
  padding: 13px 10px;
  padding-top: 50px;
  background-color: #f7f7f7;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.film-list {
  padding: 0 10px;
}

</style>
