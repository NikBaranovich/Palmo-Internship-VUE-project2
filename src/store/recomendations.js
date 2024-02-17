import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed} from "vue";

export const useRecomendationsStore = defineStore("recomendations", () => {
  const fetchTopEvents = async (params) => {
    try {
      const response = await axiosInstance.get(`events`, {
        params,
      });
      return response.data;
    } catch (error) {
      toast.error(`Error while fetching events. ${error.message}`);
    }
  };
  return {
    fetchTopEvents,
  };
});
