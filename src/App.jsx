import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./Pages/SignInPage";
import AppLayout from "./Components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TimelinePage from "./Pages/Timeline";
import ProfilePage from "./Pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ExplorePage from "./Pages/ExplorePage";
import UserPage from "./Pages/UserPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="/:userId" element={<UserPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          success: {
            duration: 8 * 1000,
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
