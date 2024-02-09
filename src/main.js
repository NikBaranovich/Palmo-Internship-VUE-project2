import "./assets/main.css";
import router from "@/router/router.js";
import PrimeVue from "primevue/config";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "primevue/resources/themes/aura-light-noir/theme.css";

import {createPinia} from "pinia";
import {createApp} from "vue";
import Vue3Toastify from "vue3-toastify";

import App from "./App.vue";

const pinia = createPinia();

createApp(App)
  .use(PrimeVue)
  .use(router)
  .use(pinia)
  .use(Vue3Toastify, {
    autoClose: 2000,
  })
  .directive("color", {
    mounted(el, binding) {
      const color = binding.value || binding.arg || "black";
      el.style.color = color;
    },
  })
  .mount("#app");
