import {defineStore} from "pinia";
import axiosInstanse from "@/services/axios.js";
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
    console.log("setup", prefId);
    if (prefId) {
      let city = cities.find(function (city, index) {
        return city.id == prefId;
      });
      Object.assign(preferredCityState, city)
      console.log(preferredCityState);
    }
    else{
      console.log(cities[0]);
      updatePreferredCity(cities[0]);
    }
  }

  const cities = computed(() => {
    return citiesState;
  });

  const fetchCities = () => {
    axiosInstanse
      .get(`cities`)
      .then((response) => {
        response.data.forEach((city) => {
          citiesState.push(city);
        });
        setupPreferredCity(response.data);

      })
      .catch((error) => {
        toast.error(`Error while fetching cities. ${error.message}`);
      });
  };

  const updatePreferredCity = (city) => {
    cookies.set("preferredCity", city.id);
    Object.assign(preferredCityState, city)
  };
  return {
    cities,
    preferredCity,
    updatePreferredCity,
    fetchCities,
    setupPreferredCity,
  };
});
