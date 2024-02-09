import {createRouter, createWebHistory} from "vue-router";

import Home from "@/components/pages/Home.vue";
import Films from "@/components/pages/Films.vue";
import Register from "@/components/pages/Register.vue";
import Login from "@/components/pages/Login.vue";
import NotFound from "@/components/pages/NotFound.vue";
const SingleEvent = () => import("@/components/pages/SingleEvent.vue");

const routes = [
  {path: "/", name: "home", component: Home},
  {path: "/films/:id", name: "event", component: SingleEvent},
  {path: "/films/", name: "films", component: Films},
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {requireNoAuth: true},
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    props: true,
    meta: {requireNoAuth: true},
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
