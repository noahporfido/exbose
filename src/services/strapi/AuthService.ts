import { LoginBody } from "../../core/types/requests/loginBody";
import apiClient from "./httpService";

const login = async (identifier: string, password: string) => {
  const response = await apiClient.post<LoginBody>("auth/local", {
    identifier,
    password,
  });

  return response.data;
};

const register = async (username: string, email: string, password: string) => {
  const response = await apiClient.post("auth/local/register", {
    username,
    email,
    password,
  });

  return response;
};

export default { login, register };
