import {createRouter, createWebHistory} from "vue-router";

import Home from "@/components/pages/Home.vue";
import Films from "@/components/pages/Films.vue";
import NotFound from "@/components/pages/NotFound.vue";
const Event = () => import("@/components/pages/Event.vue");

const routes = [
  {path: "/", name: "home", component: Home},
  {path: "/events/:id", name: "event", component: Event},
  {path: "/films/", name: "films", component: Films},
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
