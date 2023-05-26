import { defineStore } from "pinia";
import AuthService from "../services/strapi/AuthService";
import { DisplayUser } from "../core/types/display/DisplayUser";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userList: [] as DisplayUser[],
      user: null as DisplayUser | null,
      token: "" as string,
    };
  },
  getters: {
    isAuthenticated(state) {
      if (!state.token) {
        const token = localStorage.getItem("token");
        if (token) {
          this.token = token;
          return true;
        }
        return false;
      }
      return true;
    },
  },
  actions: {
    login(identifier: string, password: string) {
      AuthService.login(identifier, password).then((response) => {
        this.user = response.user;
        this.token = response.jwt;

        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", JSON.stringify(response.jwt));

        this.router.push("/");
      });
    },
    async register(username: string, email: string, password: string) {
      await AuthService.register(username, email, password);
    },
  },
});
