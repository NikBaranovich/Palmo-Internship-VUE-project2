import {defineStore} from "pinia";
import axiosInstanse from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useVenuesStore = defineStore("venues", () => {
  let venuesState = reactive([]);

  const venues = computed(() => {
    return venuesState;
  });

  const fetchVenues = () => {
    axiosInstanse
      .get(`entertainment_venues/`)
      .then((response) => {
        response.data.forEach((venue) => {
            venuesState.push(venue);
        });
      })
      .catch((error) => {
        toast.error(`Error while fetching venues. ${error.message}`);
      });
  };

  
  return {
    venues,
    fetchVenues,
  };
});
