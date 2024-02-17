<template lang="">
  <div class="film-content">
    <div class="filter-block">
      <span class="p-float-label" style="width: 200px; display: inline-block">
        <Calendar
          v-model="date"
          id="start_date"
          :minDate="minDate"
          :maxDate="maxDate"
          :manualInput="false"
          :showIcon="true"
          dateFormat="d M yy"
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
          :options="venuesList"
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
          :options="genres"
          optionLabel="name"
          :maxSelectedLabels="3"
          style="width: 200px"
          class="w-full"
        />
        <label for="ms-cities">Select Genres</label>
      </span>
      <Button @click="filterEvents()" label="Filter" />
    </div>
    <div class="film-list">
      <ul v-for="event in events.data">
        <EventListItem :event="event" />
      </ul>
    </div>
  </div>
  <div class="footer-pagination">
    <Bootstrap5Pagination
      id="pagination"
      :data="events"
      @pagination-change-page="filterEvents"
      @click="scrollToTop"
    />
  </div>
</template>
<script setup>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import EventListItem from "../EventListItem.vue";
import {Bootstrap5Pagination} from "laravel-vue-pagination";

import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";

const date = ref(new Date());
const selectedVenues = ref();
const selectedVenuesId = ref();
const selectedGenres = ref();
const selectedGenresId = ref();
const minDate = ref(new Date());
const maxDate = ref(new Date());
const router = useRouter();
const route = useRoute();

maxDate.value.setDate(maxDate.value.getDate() + 14);

import EventBox from "@/components/EventBox.vue";
import EventsCarousel from "@/components/EventsCarousel.vue";
import {watch, onMounted} from "vue";
import {useEventsStore} from "@/store/events.js";
import {useVenuesStore} from "@/store/venues.js";
import {useCitiesStore} from "@/store/cities.js";
const {venuesList, fetchVenuesList} = useVenuesStore();
const {preferredCity} = useCitiesStore();
const {
  events,
  genres,
  topEvents,
  fetchEvents,
  fetchFilteredEvents,
  fetchGenres,
} = useEventsStore();
onMounted(async () => {
  await fetchGenres();
  await fetchVenuesList({city: preferredCity.id});
});

const filterEvents = (page = 1) => {
  const query = {};

  if (date.value) {
    query.date = JSON.stringify(date.value.toDateString());
  }

  if (selectedVenues.value?.length > 0) {
    query.selectedVenues = JSON.stringify(selectedVenuesId.value);
  }

  if (selectedGenres.value?.length > 0) {
    query.selectedGenres = JSON.stringify(selectedGenresId.value);
  }

  query.page = page;

  router.push({
    query,
  });
};
watch(genres, (genres) => {
  if (isJsonString(route.query.selectedGenres) && genres.length) {
    selectedGenresId.value = route.query.selectedGenres
      ? JSON.parse(route.query.selectedGenres)
      : [];
    selectedGenres.value = selectedGenresId.value
      .map((genreId) => {
        return genres.find((genre) => genre.id === genreId);
      })
      .filter(Boolean);
  }
});
watch(preferredCity, async (preferredCity) => {
  await fetchVenuesList({city: preferredCity.id});

  if (isJsonString(route.query.date)) {
    date.value = isValidDate(new Date(JSON.parse(route.query.date)))
      ? new Date(JSON.parse(route.query.date))
      : new Date();
    if (date.value < minDate.value || date.value > maxDate.value) {
      date.value = new Date();
    }
  }

  if (isJsonString(route.query.selectedVenues)) {
    selectedVenuesId.value = route.query.selectedVenues
      ? JSON.parse(route.query.selectedVenues)
      : [];
    selectedVenues.value = selectedVenuesId.value
      .map((venueId) => {
        let venue = venuesList.find((venue) => venue.id === venueId);

        return venue;
      })
      .filter(Boolean);
  }

  fetchFilteredEvents(
    route.query.page,
    date.value,
    selectedVenuesId.value,
    selectedGenresId.value,
    preferredCity.id
  );
});

watch(
  () => route.query,
  (query) => {
    if (!Object.keys(preferredCity).length) {
      return;
    }

    if (isJsonString(query.date)) {
      date.value = isValidDate(new Date(JSON.parse(query.date)))
        ? new Date(JSON.parse(query.date))
        : new Date();
      if (date.value < minDate.value || date.value > maxDate.value) {
        date.value = new Date();
      }
    }

    if (
      isJsonString(query.selectedVenues) &&
      venuesList.length &&
      Array.isArray(JSON.parse(query.selectedVenues))
    ) {
      selectedVenuesId.value = query.selectedVenues
        ? JSON.parse(query.selectedVenues)
        : [];
      selectedVenues.value = selectedVenuesId.value
        .map((venueId) => {
          let venue = venuesList.find((venue) => venue.id === venueId);

          return venue;
        })
        .filter(Boolean);
    }
    if (
      isJsonString(query.selectedGenres) &&
      genres.length &&
      Array.isArray(JSON.parse(query.selectedGenres))
    ) {
      selectedGenresId.value = query.selectedGenres
        ? JSON.parse(query.selectedGenres)
        : [];
      selectedGenres.value = selectedGenresId.value
        .map((genreId) => {
          return genres.find((genre) => genre.id === genreId);
        })
        .filter(Boolean);
    }
    fetchFilteredEvents(
      query.page,
      date.value,
      selectedVenuesId.value,
      selectedGenresId.value,
      preferredCity.id
    );
  },
  {immediate: true}
);

watch(
  () => selectedVenues.value,
  (value) => {
    selectedVenuesId.value = value?.map((venue) => venue.id);
  },
  {immediate: true}
);
watch(
  () => selectedGenres.value,
  (value) => {
    selectedGenresId.value = value?.map((genre) => genre.id);
  },
  {immediate: true}
);
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
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
  justify-content: space-around;
}

.film-list {
  padding: 0 10px;
}
.footer-pagination {
  display: flex;
  justify-content: center;
}
</style>
