import {defineStore} from "pinia";
import {toast} from "vue3-toastify";
import axiosInstance from "@/services/axios.js";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies();

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
    return isUserLoadingState;
  });

  async function auth() {
    const token = cookies.get("personal_token");
    if (!token) {
      return;
    }
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    isUserLoadingState.value = true;
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`auth/`)
        .then((response) => {
          Object.assign(userState, response.data);
          isUserLoadingState.value = false;
          resolve(response.data);
        })
        .catch((error) => {
          toast.error(`User error. ${error.message}`);
          isUserLoadingState.value = false;
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

  async function signInWithGoogle() {}

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
