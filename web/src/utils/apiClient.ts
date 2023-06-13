import ky from "ky";
import { getApiUrl } from "./getApiUrl";

export const api = ky.create({
  prefixUrl: getApiUrl(),
  credentials: "include"
});
