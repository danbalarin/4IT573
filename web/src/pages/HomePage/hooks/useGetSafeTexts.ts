import { useCallback, useEffect, useState } from "react";
import { HTTPError } from "ky";

import { api } from "../../../utils/apiClient";
import { SafeText } from "../../../types/safe-text";
import { useDecrypt } from "../../../utils/crypto";

export const useGetSafeTexts = () => {
  const decrypt = useDecrypt();
  const [data, setData] = useState<SafeText[] | undefined>(undefined);
  const [error, setError] = useState<HTTPError | undefined>(undefined);

  const query = useCallback(async () => {
    try {
      const response = await api("safe-text", {
        method: "GET"
      });
      const responseData = (await response.json()) as SafeText[];
      setData(
        responseData.map((safeText) => ({
          ...safeText,
          text: decrypt(safeText.text)
        }))
      );
      return response;
    } catch (error) {
      setError(error as HTTPError);
    }
  }, [decrypt]);

  useEffect(() => {
    query();
  }, [query]);

  return {
    query,
    data,
    error
  };
};
