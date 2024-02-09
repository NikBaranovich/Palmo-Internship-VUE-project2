<template>
  <div class="cities-dropdown">
    <div class="dropdown">
      <div v-if="isCitiesLoading" class="btn btn-secondary">
        <p class="placeholder-glow my-0">
          <span class="placeholder rounded" style="width: 100px"></span>
        </p>
      </div>
      <div v-else>
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ preferredCity?.name }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li
            class="dropdown-item"
            v-for="city in cities"
            :data-id="city.id"
            :key="city.id"
            @click="selectCity(city)"
          >
            {{ city.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useCitiesStore} from "@/store/cities.js";
import {storeToRefs} from "pinia";

const {updatePreferredCity} = useCitiesStore();
const {isCitiesLoading, preferredCity} = storeToRefs(useCitiesStore());

const props = defineProps({
  cities: Array,
});

const selectCity = (city) => {
  updatePreferredCity(city);
};
</script>

<style scoped>
.cities-dropdown {
  position: relative;
  float: left;
  margin-right: 10px;
}

.dropdown {
  position: relative;
}

.dropdown-column {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-column:not(:last-child) {
  margin-right: 10px;
}

.dropdown-menu {
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d0d0d0;
  background-color: #fff;
  opacity: 100% !important;

  z-index: 4;
  columns: 3;
  padding: 10px 7px 10px 10px;
  width: max-content;
}

.dropdown-item {
  cursor: pointer;
  padding: 0 !important;
  color: #696969 !important;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: var(--bs-dropdown-link-color) !important;
}

.dropdown-item:active {
  color: #696969;
}
</style>
