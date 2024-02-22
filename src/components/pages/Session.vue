<template lang="">
  <div class="session-info">
    <div class="legend-wrapper">
      <div class="legend" style="padding-right: 17px; width: 67px">
        <template v-for="seatGroup in session.seat_groups">
          <div class="legend-item" popup="Вільно 3 місця">
            <span class="legend-color" :style="{background: seatGroup.color}"
              >{{ seatGroup.price }} {{ seatGroup.enabled_seats_count }}/{{
                seatGroup.seats_count
              }}</span
            >
          </div>
        </template>
      </div>
    </div>
    <div class="showtime-main-title">
      <h1 class="showtime-title">
        <a class="external" href="#">{{ session.event?.title }}</a>
      </h1>

      <div class="showtime-theater">
        city
        <a class="external" href="#">{{ session.city }}</a
        >,
        <a class="external" href="#">{{ session.venue?.name }}</a>
      </div>
      <div class="showtime-hall">Hall {{ session.hall_item?.number }}</div>
    </div>

    <div class="hall-scheme">
      <div class="container">
        <div class="row">
          <div class="col-md-7">
            <svg
              width="502px"
              height="502px"
              style="border: 2px solid #ccc"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                @mouseover="showPopup"
                @mouseleave="hidePopup"
                id="places"
                width="100%"
                height="100%"
              >
                <template v-if="session.id" v-for="element in session.hall">
                  <template v-if="element.type === 'seat'">
                    <foreignObject
                      :data-id="element.id"
                      :x="element.x"
                      :y="element.y"
                      :width="element.width"
                      :height="element.height"
                      rx="5"
                      ry="5"
                      @click="toggleSeat($event, element)"
                      :fill="element.is_enabled ? element.color : 'gray'"
                      :style="{
                        'pointer-events': element.is_enabled
                          ? 'pointer'
                          : 'none',
                      }"
                    >
                      <template
                        v-if="element.is_enabled || element.type === 'table'"
                      >
                        <div
                          class="seat-number"
                          :style="{'background-color': element.color}"
                        >
                          {{ element.number }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="seat-number" style="background-color: gray">
                          <img
                            src="https://bilet.vkino.com.ua/i/scheme/seat-occupied.png"
                          />
                        </div>
                      </template>
                    </foreignObject>
                  </template>
                  <template v-if="element.type === 'table'">
                    <circle
                      :cx="+element.x + +element.width"
                      :cy="+element.y + +element.width"
                      :r="element.width"
                      :fill="element.is_enabled ? element.color : 'gray'"
                    ></circle>
                  </template>
                </template>
                <template
                  v-for="element in JSON.parse(
                    session.hall_item?.layout || '[]'
                  )"
                >
                  <template v-if="element.type === 'scene'">
                    <foreignObject
                      class="scene-object"
                      :x="element.x"
                      :y="element.y"
                      :width="element.width"
                      :height="element.height"
                    >
                      <div class="scene">Scene</div>
                    </foreignObject>
                  </template>
                </template>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <div>
        <button class="button purchase-button" @click="handlePurchase">
          Buy tickets
        </button>
      </div>
    </div>
    <div id="showtime-poster">
      <div class="showtime-poster">
        <img
          :src="'http://localhost:8080/storage/' + session.event?.poster_path"
          :alt="session.event?.title"
          width="200"
          height="296"
        />
      </div>

      <div id="selected-seats" style="display: block">
        <ul>
          <template v-for="order in orders">
            <li>
              <span class="row">
                <span class="top"> {{ order.group_number }} </span>
                <div class="bottom">{{ order.group_name }}</div>
              </span>
              <span class="seat">
                <span class="top"> {{ order.number }} </span>
                <div class="bottom">seat</div>
              </span>
              <span class="price">
                <span class="top"> {{ order.price }} </span>
                <div class="bottom">uah</div>
              </span>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div id="popup" class="popup visually-hidden">
      <span id="popup-text"></span>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted} from "vue";
import InputText from "primevue/inputtext";
import {useRouter, useRoute} from "vue-router";
let router = useRouter();
let route = useRoute();
import {useSessionsStore} from "@/store/sessions.js";
import {useTicketsStore} from "@/store/tickets.js";
import {toast} from "vue3-toastify";

let session = ref({});
const orders = reactive([]);
const purchaseButton = document.getElementsByClassName("purchase-button")[0];

const {fetchSingleSession} = useSessionsStore();
const {processOrder, downloadTickets} = useTicketsStore();

onMounted(async () => {
  
  let response = await fetchSingleSession(route.params.id);
  if (!response) {
    router.push({
      name: "notFound",
    });
    return;
  }
  session.value = response;
});

function toggleSeat(event, element) {
  if (!element.is_enabled) {
    return;
  }
  event.target.querySelector(".seat-number").classList.toggle("seat-selected");
  if (event.target.querySelector(".seat-number").classList.contains("seat-selected")) {
    orders.push({
      id: element.id,
      group_name: element.group_name,
      group_number: element.group_number,
      number: element.number,
      price: element.price,
    });
    return;
  }
  let index = orders.findIndex((order) => order.id === element.id);
  if (index !== -1) {
    orders.splice(index, 1);
  }
}
const hideElement = (element) => {
  element.classList.add("visually-hidden");
};
const showElement = (element) => {
  element.classList.remove("visually-hidden");
};
function handlePurchase() {
  processOrder(orders, session.value.id);

  router.push("/", () => {});
}
function showPopup(event) {
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popup-text");
  if (!event.target.dataset.id) {
    return;
  }

  let element = session.value.hall.find((element) => {
    return element.id == event.target.dataset.id && element.type == "seat";
  });
  const rect = event.target.getBoundingClientRect();
  const text = `${element.group_name}, row ${element.group_number}, seat ${element.number}. Price: ${element.price} uah`;

  popupText.innerText = text;
  popup.style.top = rect.top + window.scrollY + "px";
  popup.style.left = rect.right + window.scrollX + "px";
  showElement(popup);
}
function hidePopup(event) {
  const popup = document.getElementById("popup");

  hideElement(popup);
}
</script>
<style scoped>
#labels {
  pointer-events: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}
.seat-selected {
  border: 2px solid #11952f !important;
}
#places {
  cursor: pointer;
}
.session-info {
  padding-top: 80px;
  max-width: 894px;
}
.legend-wrapper {
  top: 60px;
  bottom: 100px;
  position: fixed;
  width: 50px;
  display: block;
  max-height: 100vh;
  font-size: 15px;
  right: 0px;
}
.legend {
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 0;
  width: 50px;
  box-sizing: content-box;
  height: calc(100vh - 94px);
}
.legend-item {
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: block;
  margin: 0px;
  float: none;
}
span.legend-color {
  color: white;
  text-align: center;
  padding: 11px 0px;
  font-size: 13px;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.showtime-main-title {
  text-align: center;
  width: 640px;
  margin-bottom: 18px;
  float: left;
}
.showtime-main-title .showtime-title {
  padding-left: 30px;
  padding-right: 30px;
  margin: 0;
  display: block;
  font-size: 1.5em;
}
a.external {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  padding-right: 13px;
}
.showtime-main-title .showtime-theater {
  margin-top: 8px;
  font-size: 1.1em;
  color: #555;
}
.showtime-main-title .showtime-hall {
  color: #333;
}

.showtime-main-title .showtime-theater {
  font-size: 1.1em;
}
.showtime-theater a {
  display: inline;
  padding-right: 0;
}
.hall-scheme {
  margin-top: 4px;
  float: left;
}
.popup {
  position: absolute;
  padding: 5px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
#showtime-poster {
  float: right;
  position: relative;
  width: 200px;
}
#selected-seats {
  position: relative;
  width: 200px;
  margin-top: 16px;
}
#selected-seats ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#selected-seats li {
  margin: 0 0 10px;
  padding: 0;
  line-height: 15px;
  background-color: #f5f5f5;
  height: 32px;
  color: #000000;
  text-align: center;
}
#selected-seats .row {
  width: 100px;
  float: left;
  padding-left: 5px;
  padding-right: 5px;
}
#selected-seats li .top {
  font-size: 18px;
  line-height: 1;
  display: block;
}
#selected-seats li .bottom {
  font-size: 12px;
  line-height: 1;
  display: block;
}
#selected-seats .seat {
  width: calc(100% - 150px);
  float: left;
}
#selected-seats .price {
  float: right;
  width: 50px;
  border-left: 1px dashed #8cabed;
  color: #8cabed;
  font-weight: 600;
}
.seat-number {
  color: white;
  font: 18px serif;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  border-radius: 5px;
}
.scene {
  color: white;
  font: 18px serif;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  background-color: rgb(149, 104, 32);
  cursor: default !important;
}
.scene-object {
  cursor: default !important;
}
</style>
