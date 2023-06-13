import { LoginSchemaType } from "../login.schema";
import { api } from "../../../utils/apiClient";
import { useState } from "react";
import { HTTPError } from "ky";

export const useLogin = () => {
  const [data, setData] = useState<string | undefined>(undefined);
  const [error, setError] = useState<HTTPError | undefined>(undefined);

  const mutate = async (data: LoginSchemaType) => {
    try {
      const response = await api("auth/login", {
        method: "POST",
        json: data
      });
      setData((await response.text()) as string);
      return response;
    } catch (error) {
      setError(error as HTTPError);
    }
  };

  return {
    mutate,
    data,
    error
  };
};
