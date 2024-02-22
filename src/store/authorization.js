import {defineStore} from "pinia";
import {toast} from "vue3-toastify";
import axiosInstance from "@/services/axios.js";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies();
import {useTicketsStore} from "@/store/tickets.js";
import Echo from "laravel-echo";

import {debounce} from "../hooks/useDebouce";

import {ref, reactive, computed} from "vue";

export const useAuthorizationStore = defineStore("authorization", () => {
  //User credentials
  let userState = reactive({});
  let isUserLoadingState = ref(false);
  const user = computed(() => {
    return userState;
  });

  const isUserLoading = computed(() => {
    return isUserLoadingState.value;
  });

  async function auth() {
    return new Promise((resolve, reject) => {
      const token = cookies.get("personal_token");
      if (!token) {
        return;
      }
      const {downloadTickets} = useTicketsStore();

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      isUserLoadingState.value = true;
      axiosInstance
        .get(`auth/`)
        .then((response) => {
          Object.assign(userState, response.data);
          isUserLoadingState.value = false;

          window.Echo = new Echo({
            broadcaster: "pusher",
            authEndpoint: "http://localhost:8080/broadcasting/auth",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            encrypted: true,
            auth: {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          });

          window.Echo.private(`user-${userState.id}`).listen(
            ".ticket-generation",
            (e) => {
              downloadTickets(e.url);
            }
          );
          window.Echo.private(`user-${userState.id}`).listen(
            ".email-notification",
            (e) => {
              toast.info(e.message);
            }
          );
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`User error. ${error.message}`);
          isUserLoadingState.value = false;
          cookies.remove("personal_token");
          reject(error);
        });
    });
  }

  //Authorization
  async function register(email, password, name) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`auth/register`, {
          name,
          email,
          password,
        })
        .then((response) => {
          cookies.set("personal_token", response.data.token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          auth();

          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Registration error. ${error.response.data.message}`);
          reject(error.response.data.errors);
        });
    });
  }

  async function signIn(email, password) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`auth/login`, {
          email,
          password,
        })
        .then((response) => {
          cookies.set("personal_token", response.data.token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          auth();
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Login error. ${error.response.data.message}`);
          reject(error.response.data.errors);
        });
    });
  }

  async function signInWithGoogle(token) {
    cookies.set("personal_token", token);
    await auth()
  }

  async function logout() {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`auth/logout`)
        .then((response) => {
          Object.keys(userState).forEach((key) => {
            delete userState[key];
          });

          cookies.remove("personal_token");
          axiosInstance.defaults.headers.common = {};
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`Logout error. ${error.message}`);
          reject(error);
        });
    });
  }
  return {
    user,
    isUserLoading,
    auth,
    register,
    signIn,
    signInWithGoogle,
    logout,
  };
});
