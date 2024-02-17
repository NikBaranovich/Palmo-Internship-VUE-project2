import {defineStore} from "pinia";
import axiosInstance from "@/services/axios.js";
import {toast} from "vue3-toastify";
import {ref, reactive, computed, watch} from "vue";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies();

export const useTicketsStore = defineStore("tickets", () => {
  const processOrder = (tickets, session_id) => {
    axiosInstance
      .post(`tickets/order`, {tickets, session_id})
      .then((response) => {
        toast.success(`Thank you for your purchase! Please, wait for the report to be generated...`);
      })
      .catch((error) => {
        toast.error(`Error while fetching cities. ${error.message}`);
      });
  };
  const downloadTickets = (filepath) => {
    axiosInstance
      .get(`tickets/download`, {responseType: "blob", params: {filepath}})
      .then((response) => {
        resolveAndDownloadBlob(response);
      })
      .catch((error) => {
        toast.error(`Error while fetching cities. ${error.message}`);
      });
  };
  function resolveAndDownloadBlob(response) {
    let filename = "tickets.pdf";
    filename = decodeURI(filename);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }
  return {
    processOrder,
    downloadTickets,
  };
});
