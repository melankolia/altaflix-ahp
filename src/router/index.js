import Vue from "vue";
import VueRouter from "vue-router";
import { configRoutes } from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  // eslint-disable-next-line no-undef
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes,
});

export default router;
