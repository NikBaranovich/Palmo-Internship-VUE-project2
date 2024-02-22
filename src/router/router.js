import {createRouter, createWebHistory} from "vue-router";

import Home from "@/components/pages/Home.vue";
import CallbackGoogle from "@/components/pages/CallbackGoogle.vue";
import Films from "@/components/pages/Films.vue";
import Register from "@/components/pages/Register.vue";
import {useAuthorizationStore} from "@/store/authorization.js";
import {storeToRefs} from "pinia";
import Login from "@/components/pages/Login.vue";
import NotFound from "@/components/pages/NotFound.vue";
import Session from "@/components/pages/Session.vue";
const SingleEvent = () => import("@/components/pages/SingleEvent.vue");

const routes = [
  {path: "/", name: "home", component: Home},
  {
    path: "/callbacks/google",
    name: "callback-google",
    component: CallbackGoogle,
  },
  {path: "/films/:id", name: "event", component: SingleEvent},
  {path: "/films/", name: "films", component: Films},
  {
    path: "/session/:id",
    name: "session",
    meta: {requireAuth: true},
    component: Session,
  },
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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.name == "event")) {
    if (!Number.isInteger(Number(to.params.id))) {
      next({name: "notFound"});
      return;

    }
    next();
    return;
  }
  if (to.matched.some((record) => record.name == "session")) {
    if (!Number.isInteger(Number(to.params.id))) {
      next({name: "notFound"});
      return;

    }
    next();
    return;
  }
  if (to.matched.some((record) => record.meta.requireAuth == true)) {
    const {auth} = useAuthorizationStore();
    const {user} = storeToRefs(useAuthorizationStore());

    const isStart = !from.matched[0];

    if (isStart) {
      await auth();
    }
    const isAuth = !!Object.keys(user.value).length;
    if (!isAuth) {
      next({name: "login"});
      return;
    }
  }
  if (to.matched.some((record) => record.meta.requireNoAuth == true)) {
    const {auth} = useAuthorizationStore();
    const {user} = storeToRefs(useAuthorizationStore());

    const isStart = !from.matched[0];

    if (isStart) {
      await auth();
    }
    const isAuth = !!Object.keys(user.value).length;
    if (isAuth) {
      next({name: "home"});
      return;
    }
  }
  next();
});

export default router;
