import { User } from "../core/types/user";
import apiClient from "./httpService";

const login = async (identifier: string, password: string) => {
  const response = await apiClient.post<User>("auth/local", {
    identifier,
    password,
  });

  return response.data;
};

const register = async (username: string, email: string, password: string) => {
  const response = await apiClient.post<User>("auth/local/register", {
    username,
    email,
    password,
  });

  return response.data;
};

export default { login, register };
