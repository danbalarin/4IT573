import { HTTPError } from "ky";

export const translateError = (error?: HTTPError) => {
  switch (error?.response?.status) {
    case 401:
      return "Invalid credentials";
    case 403:
      return "You do not have permission to perform this action";
    case 404:
      return "Resource not found";
    case 500:
      return "Internal server error";
    default:
      return "An error occurred";
  }
  return "An error occurred";
};
