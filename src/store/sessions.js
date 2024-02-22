import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useSessionsStore = defineStore("sessions", () => {
  let sessionState = ref({});

  const session = computed(() => {
    return sessionState.value;
  });

  const fetchSingleSession = async (id) => {
    try {
      const response = await axiosInstance.get(`sessions/${id}`);
      return response.data;
    } catch (error) {
      toast.error(`Error while fetching session. ${error.message}`);
      return null;
    }
  };

  return {
    fetchSingleSession,
  };
});
