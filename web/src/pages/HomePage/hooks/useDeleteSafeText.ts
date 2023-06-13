import { api } from "../../../utils/apiClient";
import { useState } from "react";
import { HTTPError } from "ky";
import { SafeText } from "../../../types/safe-text";

type DeleteSafeTextVariables = {
  id: number;
};

export const useDeleteSafeText = () => {
  const [data, setData] = useState<SafeText | undefined>(undefined);
  const [error, setError] = useState<HTTPError | undefined>(undefined);

  const mutate = async ({ id }: DeleteSafeTextVariables) => {
    try {
      const response = await api(`safe-text/${id}`, {
        method: "DELETE"
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
