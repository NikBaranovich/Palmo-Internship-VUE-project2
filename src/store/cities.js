import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed, watch} from "vue";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies();

export const useCitiesStore = defineStore("cities", () => {
  let citiesState = reactive([]);

  let preferredCityState = reactive({});

  let preferredCity = computed(() => {
    return preferredCityState;
  });

  function setupPreferredCity(cities) {
    let prefId = +cookies.get("preferredCity");
    if (prefId) {
      let city = cities.find(function (city, index) {
        return city.id == prefId;
      });
      Object.assign(preferredCityState, city);
    } else {
      updatePreferredCity(cities[0]);
    }
  }

  const isCitiesLoading = computed(() => {
    return isCitiesLoadingState.value;
  });
  const isCitiesLoadingState = ref(true);

  const cities = computed(() => {
    return citiesState;
  });

  const fetchCities = async () => {
    isCitiesLoadingState.value = true;
    try {
      const response = await axiosInstance.get(`cities`);
      response.data.forEach((city) => {
        citiesState.push(city);
      });
      setupPreferredCity(response.data);
      isCitiesLoadingState.value = false;
    } catch (error) {
      toast.error(`Error while fetching cities. ${error.message}`);
      isCitiesLoadingState.value = false;
    }
  };

  const updatePreferredCity = (city) => {
    cookies.set("preferredCity", city.id);
    Object.assign(preferredCityState, city);
  };
  return {
    cities,
    preferredCity,
    isCitiesLoading,
    updatePreferredCity,
    fetchCities,
    setupPreferredCity,
  };
});
