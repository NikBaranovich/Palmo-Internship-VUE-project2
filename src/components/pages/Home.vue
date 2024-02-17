<template lang="">
  <div>
    <template v-if="topTicketEvents">
      <events-carousel :topEvents="topTicketEvents" />
    </template>
    <template v-else>
      <p class="placeholder-glow my-0">
        <span
          class="placeholder rounded"
          style="width: 100%; height: 550px"
        ></span>
      </p>
    </template>
    <section class="premiere-movies">
      <div class="content-holder">
        <div
          @click="openTrailerModal"
          id="film-holder-actual"
          class="film-box-holder"
        >
          <h2>You might like it</h2>
          <template v-if="topUserEvents">
            <Carousel
              :value="topUserEvents"
              :numVisible="5"
              :numScroll="2"
              circular
              :autoplayInterval="6000"
            >
              <template #item="slotProps">
                <event-box :event="slotProps.data" />
              </template>
            </Carousel>
          </template>
          <template v-else>
            <Carousel :value="placeholderEvents" :numVisible="5">
              <template #item="slotProps">
                <event-box :event="slotProps.data" />
              </template>
            </Carousel>
          </template>

          <template v-if="topCityEvents?.length">
            <h2>Popular in your city: {{ preferredCity.name }}</h2>
            <template v-if="topCityEvents">
              <Carousel
                :value="topCityEvents"
                :numVisible="5"
                :numScroll="2"
                circular
                :autoplayInterval="6000"
              >
                <template #item="slotProps">
                  <event-box :event="slotProps.data" />
                </template>
              </Carousel>
            </template>
            <template v-else>
              <Carousel :value="placeholderEvents" :numVisible="5">
                <template #item="slotProps">
                  <event-box :event="slotProps.data" />
                </template>
              </Carousel>
            </template>
          </template>

          <h2>Most Viewed Events</h2>
          <template v-if="topViewEvents">
            <Carousel
              :value="topViewEvents"
              :numVisible="5"
              :numScroll="2"
              circular
              :autoplayInterval="6000"
            >
              <template #item="slotProps">
                <event-box :event="slotProps.data" />
              </template>
            </Carousel>
          </template>
          <template v-else>
            <Carousel :value="placeholderEvents" :numVisible="5">
              <template #item="slotProps">
                <event-box :event="slotProps.data" />
              </template>
            </Carousel>
          </template>

          <h2>Top rated events</h2>
          <template v-if="topRateEvents">
            <Carousel
              :value="topRateEvents"
              :numVisible="5"
              :numScroll="2"
              circular
              :autoplayInterval="6000"
            >
              <template #item="slotProps">
                <event-box :event="slotProps.data" />
              </template>
            </Carousel>
          </template>
          <template v-else>
            <Carousel :value="placeholderEvents" :numVisible="5">
              <template #item="slotProps">
                <event-box :event="slotProps.data" />
              </template>
            </Carousel>
          </template>
        </div>
      </div>
    </section>
    <div id="videoModal" class="custom-modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <iframe
          id="player"
          frameborder="0"
          allowfullscreen=""
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script setup>
import EventBox from "@/components/EventBox.vue";
import Carousel from "primevue/carousel";
import EventsCarousel from "@/components/EventsCarousel.vue";
import {onMounted} from "vue";
import {useEventsStore} from "@/store/events.js";
import {useRecomendationsStore} from "@/store/recomendations.js";
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useCitiesStore} from "@/store/cities.js";

const {events, fetchEvents} = useEventsStore();
import {useAuthorizationStore} from "@/store/authorization.js";
const {user, isUserLoading} = storeToRefs(useAuthorizationStore());
const {preferredCity} = useCitiesStore();

const {fetchTopEvents} = useRecomendationsStore();
const topTicketEvents = ref(null);
const topViewEvents = ref(null);
const topUserEvents = ref(null);
const topCityEvents = ref(null);
const topRateEvents = ref(null);
const placeholderEvents = ref([{}, {}, {}, {}, {}]);

onMounted(async () => {
  topTicketEvents.value = await fetchTopEvents({limit: 4, ticket_top: true});

  topUserEvents.value = await fetchTopEvents({
    limit: 9,
    user: user.value.id,
    ticket_top: true,
  });

  topViewEvents.value = await fetchTopEvents({limit: 9, views_top: true});
  topRateEvents.value = await fetchTopEvents({limit: 9, rate_top: true});
});

watch(preferredCity, async (preferredCity) => {
  topCityEvents.value = await fetchTopEvents({
    limit: 8,
    city: preferredCity.id,
    ticket_top: true,
  });
});

function openTrailerModal(event) {
  if (!event.target.classList.contains("btn-play")) {
    return;
  }
  var modal = document.getElementById("videoModal");
  var button = event.target;
  var closeButton = document.getElementsByClassName("close")[0];
  var videoFrame = document.getElementById("player");

  modal.style.display = "block";
  videoFrame.src = getEmbedUrl(button.dataset.youtube_url);

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
    videoFrame.src = "";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      videoFrame.src = "";
    }
  });
}
function getEmbedUrl(url) {
  const videoId = url?.split("=")[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&controls=1&modestbranding=1&enablejsapi=1&origin=https%3A%2F%2Fvkino.com.ua&widgetid=1`;
}

</script>
<style scoped>
.film-box-holder h2 {
  font-size: 30px;
  line-height: 32px;
  font-weight: 400;
  margin: 0 0 31px;
  text-align: center;
}
.custom-modal {
  display: none;
  position: fixed;
  padding-top: 100px;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.8);
}

.custom-modal .modal-content {
  background-color: #fefefe;
  margin: 0 auto;
  padding: 20px;
  height: 600px;
  border: 1px solid #888;
  width: 80%;
}
.modal-content iframe {
  width: 100%;
  height: 100%;
  max-height: 487px;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
