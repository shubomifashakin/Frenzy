import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./Pages/SignInPage";
import AppLayout from "./Components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TimelinePage from "./Pages/TimelinePage";
import ProfilePage from "./Pages/ProfilePage";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route element={<AppLayout />}>
            <Route path="timeline/:userId" element={<TimelinePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#abf7b1",
            },
          },
          error: {
            duration: 10 * 1000,
            style: {
              background: "#ff6865",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
