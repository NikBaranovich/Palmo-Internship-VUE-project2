<template>
  <header id="header">
    <div class="header-holder">
      <h1 class="logo">
        <a href="/"> StagePassPro </a>
      </h1>

      <nav id="nav">
        <ul>
          <li><router-link :to="{name: 'films'}">Films</router-link></li>
          <li><a href="/cinemas">Cinema</a></li>
        </ul>
      </nav>

      <form class="search" action="#" onsubmit="return false;">
        <fieldset>
          <input
            type="text"
            name="searchajax"
            id="search-field"
            class="search-head"
            autocomplete="off"
            placeholder="Search"
          />
          <ul
            class="head-search-result-list search-focus search-list"
            id="search-ul"
          ></ul>
        </fieldset>
      </form>
      <div class="head-links">
        <city-list :cities="cities" />

        <div class="user-panel">
          <a href="#" class="title vkino-link btn-buy" target="_top"
            >My tickets</a
          >
        </div>

        <toggle-switch v-model="isLightTheme" />
      </div>
    </div>
  </header>
</template>

<script setup>
import ToggleSwitch from "@/components/UI/ToggleSwitch.vue";
import CityList from "@/components/UI/CityList.vue";

import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {onMounted} from "vue";
import {useCitiesStore} from "@/store/cities.js";
import {useCookies} from "vue3-cookies";
let router = useRouter();

const {cities, preferredCity, setupPreferredCity, fetchCities} =
  useCitiesStore();
const {cookies} = useCookies();

onMounted(() => {
  fetchCities();
});

//Theme switch
function getMediaPreference() {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  return hasDarkPreference;
}
function getTheme() {
  const theme = localStorage.getItem("user-theme");
  return theme == "light-theme" ? true : false;
}
function setTheme(isLightTheme) {
  const theme = isLightTheme ? "light-theme" : "dark-theme";
  localStorage.setItem("user-theme", theme);
  document.documentElement.className = theme;
}

const initUserTheme = getTheme() || getMediaPreference();
setTheme(initUserTheme);

let isLightTheme = ref(getTheme());
watch(isLightTheme, () => {
  setTheme(isLightTheme.value);
});
</script>

<style scoped></style>
