import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
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

  let genresState = reactive([]);

  const genres = computed(() => {
    return genresState;
  });

  const fetchEvents = () => {
    axiosInstance
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
  const fetchSingleEvent = async (id) => {
    try {
      const response = await axiosInstance.get(`events/${id}`);
      return response.data;
    } catch (error) {
      toast.error(`Error while fetching events. ${error.message}`);
      return null;
    }
  };
  const fetchGenres = async () => {
    try {
      const response = await axiosInstance.get(`genres/`);
      response.data.forEach((genre) => {
        genresState.push(genre);
      });
    } catch (error) {
      toast.error(`Error while fetching events. ${error.message}`);
    }
  };
  const incrementViews = async (id) => {
    try {
      await axiosInstance.get(`events/${id}/increment`);
    } catch (error) {
      toast.error(`Error. ${error.message}`);
    }
  };
  const fetchTopEvents = (limit) => {
    axiosInstance
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
    axiosInstance
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

  const searchEvents = async (title) => {
    try {
      const response = await axiosInstance.get(`events/search`, {
        params: {
          title,
        },
      });
      return response.data;
    } catch (error) {
      toast.error(`Error. ${error.message}`);
    }
  };

  const rateEvent = (event_id, vote) => {
    axiosInstance
      .post(`events/${event_id}/rate`, {vote})
      .then((response) => {
        toast.success(`Event rated!`);
      })
      .catch((error) => {
        toast.error(`Error rating. ${error.message}`);
      });
  };

  const getUserRating = async (event_id) => {
    try {
      const response = await axiosInstance.get(`events/${event_id}/user-vote`);
      return response.data.vote;
    } catch (error) {
      toast.error(`Error. ${error.message}`);
    }
  };
  return {
    events,
    topEvents,
    genres,
    fetchEvents,
    fetchTopEvents,
    fetchFilteredEvents,
    incrementViews,
    fetchSingleEvent,
    fetchGenres,
    searchEvents,
    rateEvent,
    getUserRating,
  };
});
