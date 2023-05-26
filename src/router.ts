import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Admin from "./pages/AdminPanel.vue";
import Register from "./pages/Register.vue";
import { middleware } from "./middleware/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      beforeEnter: middleware,
    },
    {
      path: "/admin",
      component: Admin,
      beforeEnter: middleware,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
  ],
});

export default router;
