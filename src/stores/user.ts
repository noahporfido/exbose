import { defineStore } from "pinia";
import { User } from "../core/types/user";
import AuthService from "../services/AuthService";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userList: [] as User[],
      user: null as User | null,
    };
  },
  getters: {
    getFullName(state): string {
      return `${state.user?.firstName}, ${state.user?.lastName}`;
    },
  },
  actions: {
    async login(identifier: string, password: string) {
      this.user = await AuthService.login(identifier, password);
    },
    async register(username: string, email: string, password: string) {
      await AuthService.register(username, email, password);
    },
  },
});
