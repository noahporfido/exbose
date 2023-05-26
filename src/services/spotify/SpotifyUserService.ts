import apiClient from "./spotifyHttpService";

const login = async (identifier: string, password: string) => {
  const response = await apiClient.post("auth/local", {
    identifier,
    password,
  });

  return response.data;
};
