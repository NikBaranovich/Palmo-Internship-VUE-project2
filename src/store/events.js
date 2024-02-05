import {defineStore} from "pinia";
import axiosInstanse from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useEventsStore = defineStore("events", () => {
  let eventsState = reactive([]);

  const events = computed(() => {
    return eventsState;
  });

  let topEventsState = reactive([]);

  const topEvents = computed(() => {
    return topEventsState;
  });

  let eventGenresState = reactive([]);

  const eventGenres = computed(() => {
    return eventGenresState;
  });

  const fetchEvents = () => {
    axiosInstanse
      .get(`events/index`)
      .then((response) => {
        response.data.forEach((event) => {
          eventsState.push(event);
        });
      })
      .catch((error) => {
        toast.error(`Error while fetching events. ${error.message}`);
      });
  };
  const fetchEventGenres = () => {
    axiosInstanse
      .get(`event-genres/`)
      .then((response) => {
        response.data.forEach((genres) => {
          eventGenresState.push(genres);
        });
      })
      .catch((error) => {
        toast.error(`Error while fetching events. ${error.message}`);
      });
  };
  const fetchTopEvents = () => {
    axiosInstanse
      .get(`events/get-top?limit=4`)
      .then((response) => {
        eventsState.length = 0;
        response.data.forEach((event) => {
          topEventsState.push(event);
        });
      })
      .catch((error) => {
        toast.error(`Error while fetching top events. ${error.message}`);
      });
  };

  const fetchFilteredEvents = (startDate, venues) => {
    axiosInstanse
      .get(`events/filter`, {params: {start_date: startDate, venues: venues}})
      .then((response) => {
        eventsState.length = 0;
        response.data.forEach((event) => {
          eventsState.push(event);
        });
      })
      .catch((error) => {
        toast.error(`Error while fetching top events. ${error.message}`);
      });
  };
  return {
    events,
    topEvents,
    eventGenres,
    fetchEvents,
    fetchTopEvents,
    fetchFilteredEvents,
    fetchEventGenres,
  };
});
