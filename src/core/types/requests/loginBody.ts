import { DisplayUser } from "../display/DisplayUser";

export interface LoginBody {
  jwt: string;
  user: DisplayUser;
}
