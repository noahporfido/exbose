import http from "./httpService";

class SpotifyService {
  get(id: any): Promise<any> {
    return http.get(`/tutorials/${id}`);
  }
}

export default new SpotifyService();
