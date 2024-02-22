<template>
  <header id="header">
    <div class="header-holder">
      <h1 class="logo">
        <a href="/"> StagePassPro </a>
      </h1>

      <nav id="nav">
        <ul>
          <li><router-link :to="{name: 'films'}">Films</router-link></li>
        </ul>
      </nav>

      <div class="form-group">
        <fieldset class="position-relative">
          <InputText
            placeholder="Search"
            v-model="searchText"
            @focus="showElement($refs.eventOptions)"
            @focusout="handleSearchInputFocusOut($refs.eventOptions)"
            ref="eventInput"
          />
          <datalist
            @click="handleDatalistEventClick($event, $refs.eventOptions)"
            class="visually-hidden"
            id="event-options"
            ref="eventOptions"
          >
            <template v-for="event in events">
              <option :value="event.id">
                {{ event.title }}
              </option>
            </template>
          </datalist>
        </fieldset>
      </div>

      <div class="head-links">
        <div class="user-panel">
          <div
            v-color:white
            v-if="user && Object.keys(user).length"
            class="user-info"
          >
            <span class="username">Welcome, {{ user.name }}</span>
            <button class="btn btn-danger" @click="logoutHandler">
              Logout
            </button>
          </div>
          <div v-else-if="isUserLoading">
            <p class="placeholder-glow my-0">
              <span class="placeholder rounded" style="width: 200px"></span>
            </p>
          </div>
          <div class="user-info" v-else>
            <router-link class="btn btn-primary me-4" :to="{name: 'login'}"
              >Login</router-link
            >
            <router-link class="btn btn-success" :to="{name: 'register'}"
              >Register</router-link
            >
          </div>
        </div>
        <city-list :cities="cities" />

        <toggle-switch v-model="isLightTheme" />
      </div>
    </div>
  </header>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import InputText from "primevue/inputtext";

import ToggleSwitch from "@/components/UI/ToggleSwitch.vue";
import CityList from "@/components/UI/CityList.vue";
import {useAuthorizationStore} from "../store/authorization.js";
import {debounce} from "../hooks/useDebouce";

import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {onMounted} from "vue";
import {useCitiesStore} from "@/store/cities.js";
import {useEventsStore} from "@/store/events.js";
import {useCookies} from "vue3-cookies";
import {storeToRefs} from "pinia";

let router = useRouter();
const {auth, logout} = useAuthorizationStore();
const {user, isUserLoading} = storeToRefs(useAuthorizationStore());

const {cities, fetchCities} = useCitiesStore();
const {searchEvents} = useEventsStore();
const {cookies} = useCookies();

const searchText = ref("");
const events = ref(null);
function logoutHandler() {
  logout();
  router.push({
    name: "home",
  });
}

async function fetchEvents(title) {
  if (!title) {
    return;
  }

  events.value = await searchEvents(title);
}

watch(searchText, (searchText) => {
  debounce(() => {
    fetchEvents(searchText);
  });
});

function handleDatalistEventClick(event, datalistEvents) {
  const target = event.target;

  if (target.tagName === "OPTION") {
    searchText.value = "";
    router.push({path: `/films/${+target.value}`});
  }
  hideElement(datalistEvents);
}

//Theme switch
function getMediaPreference() {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  return hasDarkPreference;
}
function getTheme() {
  let theme = cookies.get("user-theme");
  if (!theme) {
    theme = getMediaPreference() ? "light-theme" : "dark-theme";
  }
  return theme == "light-theme" ? true : false;
}
function setTheme(isLightTheme) {
  const theme = isLightTheme ? "light-theme" : "dark-theme";
  cookies.set("user-theme", theme);
  document.documentElement.className = theme;
}

const initUserTheme = getTheme();
setTheme(initUserTheme);

let isLightTheme = ref(getTheme());
watch(isLightTheme, () => {
  setTheme(isLightTheme.value);
});

const hideElement = (element) => {
  element.classList.add("visually-hidden");
};
const showElement = (element) => {
  element.classList.remove("visually-hidden");
};

function handleSearchInputFocusOut(datalist) {
  setTimeout(() => {
    hideElement(datalist);
  }, 300);
}
</script>

<style scoped>
datalist {
  display: block !important;
  position: absolute;
  background-color: white;
  border: 1px solid #adb5bd;
  border-radius: 0 0 5px 5px;
  border-top: none;
  width: 100%;
  padding: 5px;
  max-height: 10rem;
  overflow-y: auto;
  z-index: 999;
}

option {
  padding: 4px;
  margin-bottom: 1px;
  cursor: pointer;
}

option:hover {
  background-color: #d3d3d3;
}
.username {
  padding-right: 5px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.user-info {
  width: 200px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.form-group {
  width: 350px;
}
</style>
