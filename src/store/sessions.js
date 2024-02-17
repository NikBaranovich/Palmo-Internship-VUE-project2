import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useSessionsStore = defineStore("sessions", () => {
  let sessionState = ref({});

  const session = computed(() => {
    return sessionState.value;
  });

  const fetchSingleSession = (id) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`sessions/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Error while fetching session. ${error.message}`);
          reject(error);
        });
    });
  };

  return {
    fetchSingleSession,
  };
});
