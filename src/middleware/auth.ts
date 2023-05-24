import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "../stores/user";

export const middleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useUserStore();
  if (store.isAuthenticated) {
    next();
  } else {
    next("/login");
  }
};
