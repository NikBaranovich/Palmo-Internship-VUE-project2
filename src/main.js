import './assets/main.css'
import router from "@/router/router.js";
import 'bootstrap/dist/js/bootstrap.bundle.js';

import {createPinia} from "pinia";
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia();

createApp(App)
        .use(router)
        .use(pinia)
        .mount('#app')
