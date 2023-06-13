import { LoginSchemaType } from "../login.schema";
import { api } from "../../../utils/apiClient";
import { useState } from "react";
import { HTTPError } from "ky";

type SignupResponse = {
  email: string;
  id: number;
};

export const useSignup = () => {
  const [data, setData] = useState<SignupResponse | undefined>(undefined);
  const [error, setError] = useState<HTTPError | undefined>(undefined);

  const mutate = async (data: LoginSchemaType) => {
    try {
      const response = await api("auth/signup", {
        method: "POST",
        json: data
      });
      setData((await response.json()) as SignupResponse);
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
