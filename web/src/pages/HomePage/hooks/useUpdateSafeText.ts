import { useState } from "react";
import { HTTPError } from "ky";

import { SafeText } from "../../../types/safe-text";
import { api } from "../../../utils/apiClient";
import { useEncrypt } from "../../../utils/crypto";

type UpdateSafeTextVariables = {
  id: number;
  text: string;
  domain?: string;
};

export const useUpdateSafeText = () => {
  const encrypt = useEncrypt();
  const [data, setData] = useState<SafeText | undefined>(undefined);
  const [error, setError] = useState<HTTPError | undefined>(undefined);

  const mutate = async ({ id, ...data }: UpdateSafeTextVariables) => {
    try {
      const response = await api(`safe-text/${id}`, {
        method: "PATCH",
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
