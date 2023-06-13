import ThemeProvider from "../ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "../../pages/HomePage";
import { UserContextProvider } from "../../contexts/UserContext";

const queryClient = new QueryClient();

function Root() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <HomePage />
        </UserContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default Root;
