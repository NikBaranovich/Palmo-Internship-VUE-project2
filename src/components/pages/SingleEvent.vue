<template lang="">
  <section class="film-section">
    <div class="visual-box">
      <img
        :alt="event.title"
        :src="
          'http://localhost:8080/storage/' + event.backdrop_path
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
                'http://localhost:8080/storage/' +
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

            <div class="rating-star">
              <span class="star"
                ><span
                  :style="{
                    width: parseFloat(event.rating_avg * 10).toFixed(0) + '%',
                  }"
                ></span
              ></span>
              <span class="value-votes average">{{
                parseFloat(event.rating_avg || 0).toFixed(1)
              }}</span>
            </div>
          </div>
        </div>
        <dl class="film-data-list">
          <dt>Genres:</dt>
          <dd>{{ event.genres?.map((genre) => genre.name).join(", ") }}</dd>
        </dl>
        <template v-if="user.id">
          <Rating v-model="rating" :cancel="false" @click="rateEventClick" />
        </template>
        <a class="btn-buy btn-buy-film" href="#schedule">Buy tickets</a>
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
            v-model="selectedCities"
            :options="cities"
            optionLabel="name"
            :maxSelectedLabels="3"
            style="width: 200px"
            class="w-full"
          />
          <label for="ms-cities">Select Cities</label>
        </span>
        <Button @click="filterSessions()" label="Filter" />
      </div>
    </div>
  </div>

  <section id="schedule" class="schedule-section">
    <div class="schedule-section-holder">
      <div class="schedule-box" style="opacity: 1">
        <SheduleListItem v-for="venue in venues" :venue="venue" />
      </div>
    </div>
  </section>
</template>
<script setup>
import Button from "primevue/button";
import Rating from "primevue/rating";
import Calendar from "primevue/calendar";
import SheduleListItem from "../ScheduleListItem.vue";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import {useCitiesStore} from "@/store/cities.js";
import {useEventsStore} from "@/store/events.js";
import {useAuthorizationStore} from "@/store/authorization.js";

import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useVenuesStore} from "@/store/venues.js";
import {storeToRefs} from "pinia";

const {cities, preferredCity} = useCitiesStore();
const {user, isUserLoading} = storeToRefs(useAuthorizationStore());
const {fetchVenues, fetchVenuesList} = useVenuesStore();
const venues = ref(null);
const date = ref(new Date());
const selectedCities = ref();
const selectedCitiesId = ref();
let router = useRouter();
let route = useRoute();
let event = ref("");
let rating = ref();
const minDate = ref(new Date());
const maxDate = ref(new Date());
maxDate.value.setDate(maxDate.value.getDate() + 7);

watch(
  () => selectedCities.value,
  (value) => {
    selectedCitiesId.value = value?.map((city) => city.id);
  },
  {immediate: true}
);
watch(cities, async (cities) => {
  if (isJsonString(route.query.date)) {
    date.value = isValidDate(new Date(JSON.parse(route.query.date)))
      ? new Date(JSON.parse(route.query.date))
      : new Date();
    if (date.value < minDate.value || date.value > maxDate.value) {
      date.value = new Date();
    }
  }

  if (isJsonString(route.query.selectedCities) && cities.length) {
    selectedCitiesId.value = route.query.selectedCities
      ? JSON.parse(route.query.selectedCities)
      : [];
    selectedCities.value = selectedCitiesId.value
      .map((cityId) => {
        return cities.find((city) => city.id === cityId);
      })
      .filter(Boolean);
  }

  venues.value = await fetchVenues({
    cities: selectedCitiesId.value,
    start_date: date.value,
    event: route.params.id,
  });
  console.log(venues.value);
});
watch(
  () => route.query,
  async (query) => {
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
      isJsonString(query.selectedCities) &&
      cities.length &&
      Array.isArray(JSON.parse(query.selectedCities))
    ) {
      selectedCitiesId.value = query.selectedCities
        ? JSON.parse(query.selectedCities)
        : [];
      selectedCities.value = selectedCitiesId.value
        .map((cityId) => {
          let city = cities.find((city) => city.id === cityId);

          return city;
        })
        .filter(Boolean);
    }

    venues.value = await fetchVenues({
      cities: selectedCitiesId.value,
      start_date: date.value,
      event: event.value.id,
    });
    console.log(venues.value);
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
const filterSessions = () => {
  const query = {};

  if (date.value) {
    query.date = JSON.stringify(date.value.toDateString());
  }

  if (selectedCities.value?.length > 0) {
    query.selectedCities = JSON.stringify(selectedCitiesId.value);
  }

  router.push({
    query,
  });
};

const previousRating = ref(0);
const {fetchSingleEvent, incrementViews, rateEvent, getUserRating} =
  useEventsStore();

onMounted(async () => {
  event.value = await fetchSingleEvent(route.params.id);
  incrementViews(event.value.id);
});

watch(
  () => route.params.id,
  async (id) => {
    event.value = await fetchSingleEvent(id);
    venues.value = await fetchVenues({
      cities: selectedCitiesId.value,
      start_date: date.value,
      event: event.value.id,
    });
    console.log(venues.value);

    rating.value = Number(await getUserRating(event.value.id));
    previousRating.value = rating.value;
  }
);

watch(user.value, async (user) => {
  rating.value = Number(await getUserRating(event.value.id));
  previousRating.value = rating.value;
});
function rateEventClick() {
  rateEvent(event.value.id, rating.value);

  event.value.rating_avg =
    (event.value.rating_avg * event.value.rating_count -
      previousRating.value +
      rating.value) /
    (event.value.rating_count + (previousRating.value ? 0 : 1));

  previousRating.value = rating.value;
}

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
  margin: 0 0 40px;
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
  padding: 30px 0 15px 0;
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

.rating {
  float: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.rating-star {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.star {
  width: 60px;
  height: 60px;
  margin-right: 8px;
  display: block;
  background: url(https://kinoafisha.ua/themes/kino/images/svg/rate.svg)
    no-repeat left top;
  background-size: cover;
}
.star span {
  display: block;
  height: 14px;
  background: url(https://kinoafisha.ua/themes/kino/images/svg/star.svg)
    no-repeat left top;
  background-size: cover;
  height: 60px;
}
.value-votes {
  font-size: 25px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #999;
}

.count-votes {
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #999;
  margin-bottom: 5px;
}
</style>
