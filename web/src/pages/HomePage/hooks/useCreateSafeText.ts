import { useState } from "react";
import { HTTPError } from "ky";

import { api } from "../../../utils/apiClient";
import { SafeText } from "../../../types/safe-text";
import { useEncrypt } from "../../../utils/crypto";

type CreateSafeTextVariables = {
  text: string;
  domain?: string;
};

export const useCreateSafeText = () => {
  const encrypt = useEncrypt();
  const [data, setData] = useState<SafeText | undefined>(undefined);
  const [error, setError] = useState<HTTPError | undefined>(undefined);

  const mutate = async (data: CreateSafeTextVariables) => {
    try {
      const response = await api("safe-text", {
        method: "POST",
        json: {
          ...data,
          text: encrypt(data.text)
        }
      });
      setData((await response.json()) as SafeText);
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
