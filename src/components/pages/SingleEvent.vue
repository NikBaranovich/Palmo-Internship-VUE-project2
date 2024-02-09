<template lang="">
  <section class="film-section">
    <div class="visual-box">
      <img
        :alt="event.title"
        :src="
          'http://localhost:8080/storage/events/backdrops' + event.backdrop_path
        "
      />
    </div>
    <div class="film-section-holder">
      <div class="film-block">
        <strong class="title mobile-hidden">{{ event.title }}</strong>
        <div class="film-info-holder">
          <div class="img-holder">
            <img
              :src="
                'http://localhost:8080/storage/events/posters' +
                event.poster_path
              "
              :alt="event.title"
            />
          </div>
          <div v-if="event" class="film-info">
            <div class="premiere-info">
              <span class="premiere-title">Premier</span>
              <span class="date">{{ getDate(event.release_date) }}</span>
              <span class="month">{{ getMonth(event.release_date) }}</span>
            </div>
          </div>
        </div>
        <dl class="film-data-list">
          <dt>Genres:</dt>
          <dd>{{ event.genres?.map((genre) => genre.name).join(", ") }}</dd>
        </dl>
        <Rating v-model="rating" :cancel="false" />
        <a class="btn-buy btn-buy-film" href="#top">Buy tickets</a>
      </div>
      <div class="trailer">
        <div id="trailer-holder">
          <iframe
            v-if="event.trailer_url"
            id="player"
            frameborder="0"
            allowfullscreen=""
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            :title="event.title + 'Official trailer'"
            :src="getEmbedUrl(event.trailer_url)"
          ></iframe>
          <img class="player-thumbnail" src="" alt="" />
          <a class="btn-ytp-play" href="#"></a>
        </div>
      </div>
    </div>
  </section>
  <div class="tab-content">
    <div class="filter filter-theaters">
      <div class="filter-holder">
        <span class="p-float-label" style="width: 200px; display: inline-block">
          <!-- <Calendar
            v-model="date"
            id="start_date"
            :minDate="minDate"
            :maxDate="maxDate"
            :manualInput="false"
            :showIcon="true"
            dateFormat="d M yy"
          /> -->
          <label for="start_date">Choose event date</label>
        </span>
        <span
          class="p-float-label w-full md:w-20rem"
          style="width: 200px; display: inline-block"
        >
          <!-- <MultiSelect
            id="ms-cities"
            v-model="selectedVenues"
            :options="venuesList"
            optionLabel="name"
            :maxSelectedLabels="3"
            style="width: 200px"
            class="w-full"
          /> -->
          <label for="ms-cities">Select Venues</label>
        </span>
        <span
          class="p-float-label w-full md:w-20rem"
          style="width: 200px; display: inline-block"
        >
          <!-- <MultiSelect
            id="ms-cities"
            v-model="selectedGenres"
            :options="eventGenres"
            optionLabel="name"
            :maxSelectedLabels="3"
            style="width: 200px"
            class="w-full"
          /> -->
        </span>
      </div>
    </div>
  </div>

  <section class="schedule-section">
    <div class="schedule-section-holder">
      <div class="schedule-box" style="opacity: 1">
        <SheduleListItem v-for="venue in venues" :venue="venue" />
      </div>
    </div>
  </section>
</template>
<script setup>
import Rating from "primevue/rating";
import Calendar from "primevue/calendar";
import SheduleListItem from "../ScheduleListItem.vue";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import {useCitiesStore} from "@/store/cities.js";
import {useEventsStore} from "@/store/events.js";
import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useVenuesStore} from "@/store/venues.js";

const {preferredCity} = useCitiesStore();
const {venues, venuesList, fetchVenues, fetchVenuesList} = useVenuesStore();

let router = useRouter();
let route = useRoute();
let event = ref("");
let rating = ref();
const {fetchSingleEvent} = useEventsStore();

onMounted(async () => {
  event.value = await fetchSingleEvent(route.params.id);
  await fetchVenues({event: event.value.id});
  await fetchVenuesList();
});

watch(preferredCity, async (preferredCity) => {
  //   fetchFilteredEvents(
  //     route.query.page,
  //     date.value,
  //     selectedVenuesId.value,
  //     selectedGenresId.value,
  //     preferredCity.id
  //   );
});

const minDate = ref(new Date());
const maxDate = ref(new Date());
maxDate.value.setDate(maxDate.value.getDate() + 7);

function getDate(dateString) {
  const date = new Date(dateString);
  return date.getDate();
}
function getMonth(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("en-us", {month: "long", year: "numeric"});
}
function getEmbedUrl(url) {
  const videoId = url?.split("=")[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&controls=1&modestbranding=1&enablejsapi=1&origin=https%3A%2F%2Fvkino.com.ua&widgetid=1`;
}
</script>
<style scoped>
.film-section {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.film-section img {
  width: 100%;
}
img {
  border-style: none;
  max-width: 100%;
  height: auto;
  display: block;
}
.film-section-holder {
  max-width: 1175px;
  margin: 0 auto;
  overflow: hidden;
  padding: 66px 25px 65px;
  position: relative;
  z-index: 3;
}
.film-section .visual-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
}
.film-section:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(51, 44, 42, 0.8);
}
.film-block {
  float: left;
  width: 275px;
  padding: 10px 0 0;
}
.film-section .title {
  font-size: 25px;
  line-height: 27px;
  font-weight: normal;
  color: #fff;
  display: block;
  margin: 0 0 10px;
}
.film-block .film-info-holder {
  width: 100%;
  overflow: hidden;
  margin: 0 0 15px;
}
.film-block .img-holder {
  width: 175px;
  height: 248px;
  overflow: hidden;
  float: left;
}
.film-section .film-info {
  float: right;
  width: 79px;
  height: 82px;
  position: relative;
}
.film-section .premiere-info {
  border: 2px solid #999;
  color: #999;
  border-radius: 3px;
  text-align: center;
  position: relative;
  margin: 0 0 102px;
  width: 75px;
  padding: 10px 0;
}
.film-block .film-info-holder {
  width: 100%;
  overflow: hidden;
  margin: 0 0 15px;
}
.film-block .img-holder {
  width: 175px;
  height: 248px;
  overflow: hidden;
  float: left;
}
.film-section .film-info {
  float: right;
  width: 79px;
  height: 82px;
  position: relative;
}
.film-section .premiere-info .premiere-title {
  font-size: 12px;
  line-height: 14px;
  font-weight: 600;
  text-transform: uppercase;
  display: block;
  margin: 0 0 2px;
}
.film-section .premiere-info .date {
  font-size: 28px;
  line-height: 30px;
  font-weight: 600;
  display: block;
}
.film-section .premiere-info .month {
  font-size: 12px;
  line-height: 14px;
}
.film-section .film-info.passed:after {
  background-position: -374px -272px;
}
.film-data-list {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 18px;
}
.film-data-list dt {
  float: left;
  clear: left;
  color: #847976;
  margin: 0 18px 0 0;
}
.film-data-list dd {
  color: #fff;
  display: block;
  margin: 0 0 2px;
  overflow: hidden;
}
.film-section .btn-buy {
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  padding: 10px 13px 10px 23px;
  background: #ffa700;
  display: inline-block;
  vertical-align: top;
  position: relative;
  min-width: 114px;
}
.trailer {
  position: relative;
  float: right;
  width: 74.5%;
  max-height: 487px;
}
.trailer #trailer-holder {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 0;
  height: 0;
  overflow: hidden;
  max-height: 487px;
}
#trailer-holder iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: 487px;
}
.tab-content {
  width: 100%;
  background: #fff;
  padding: 0;
}
.filter {
  width: 100%;
  padding: 15px 0 5px 0;
  background: #fff;
  z-index: 99;
}
.filter-holder {
  max-width: 1175px;
  padding: 0 25px;
  margin: 0 auto;
}
.schedule-box {
  width: 100%;
  overflow: hidden;
  margin: 0 0 77px;
  position: relative;
}
.schedule-section-holder {
  padding: 16px 0 0;
  max-width: 1225px;
  margin: 0 auto;
}
</style>
