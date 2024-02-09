import {defineStore} from "pinia";
import axiosInstanse from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useEventsStore = defineStore("events", () => {
  let eventsState = ref({});

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
      .get(`events/`, {
        params: {per_page: 100},
      })
      .then((response) => {
        eventsState.value = response.data;
      })
      .catch((error) => {
        toast.error(`Error while fetching events. ${error.message}`);
      });
  };
  const fetchSingleEvent = (id) => {
    return new Promise((resolve, reject) => {
      axiosInstanse
        .get(`events/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Error while fetching venues. ${error.message}`);
          reject(error);
        });
    });
  };
  const fetchEventGenres = async () => {
    try {
      const response = await axiosInstanse.get(`event-genres/`);
      response.data.forEach((genre) => {
        eventGenresState.push(genre);
      });
    } catch (error) {
      toast.error(`Error while fetching events. ${error.message}`);
    }
  };
  const fetchTopEvents = (limit) => {
    axiosInstanse
      .get(`events`, {
        params: {limit, ticket_top: true},
      })
      .then((response) => {
        topEventsState.length = 0;
        response.data.forEach((event) => {
          topEventsState.push(event);
        });
      })
      .catch((error) => {
        toast.error(`Error while fetching top events. ${error.message}`);
      });
  };

  const fetchFilteredEvents = (page, startDate, venues, genres, city) => {
    startDate = startDate ? startDate.toLocaleString() : null;
    axiosInstanse
      .get(`events`, {
        params: {page, start_date: startDate, venues: venues, genres, city},
      })
      .then((response) => {
        eventsState.value = response.data;
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
    fetchSingleEvent,
    fetchEventGenres,
  };
});
