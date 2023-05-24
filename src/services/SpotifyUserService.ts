import http from "./httpService";

class SpotifyUserService {
  getToken(): Promise<any> {
    return http.post(`/token`);
  }
}

export default new SpotifyUserService();
