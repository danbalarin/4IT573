export const getApiUrl = (path?: string) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl);
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not set");
  }
  return `${apiUrl}/${path ?? ""}`;
};
