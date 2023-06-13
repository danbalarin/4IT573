import { useCallback } from "react";
import CryptoJS from "crypto-js";

import { useUserContext } from "../contexts/UserContext";

export const useEncrypt = () => {
  const { email } = useUserContext();

  return useCallback(
    (text: string) => CryptoJS.AES.encrypt(text, email || "").toString(),
    [email]
  );
};

export const useDecrypt = () => {
  const { email } = useUserContext();

  return useCallback(
    (text: string) =>
      CryptoJS.AES.decrypt(text, email || "").toString(CryptoJS.enc.Utf8),
    [email]
  );
};
