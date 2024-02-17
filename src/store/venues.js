import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useVenuesStore = defineStore("venues", () => {
  let venuesState = reactive([]);

  const venues = computed(() => {
    return venuesState;
  });

  let venuesListState = reactive([]);

  const venuesList = computed(() => {
    return venuesListState;
  });

  const fetchVenues = async (params) => {
    params.start_date = params.start_date ? params.start_date.toLocaleString() : null;

    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`entertainment_venues/`, {params})
        .then((response) => {
          venuesState.length = 0;
          console.log("object");
          response.data.forEach((venue) => {
            venuesState.push(venue);
          });
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Error while fetching venues. ${error.message}`);
          reject(error);
        });
    });
  };
  const fetchVenuesList = async (params) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`entertainment_venues/list`, {params})
        .then((response) => {
          venuesListState.length = 0;
          response.data.forEach((venue) => {
            venuesListState.push(venue);
          });
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Error while fetching venues. ${error.message}`);
          reject(error);
        });
    });
  };

  return {
    venues,
    venuesList,
    fetchVenues,
    fetchVenuesList,
  };
});
