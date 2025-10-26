import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./features/auth/pages/SignInPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ResidentLayout from "./features/resident/layout/ResidentLayout";
import AdminLayout from "./features/admin/layout/AdminLayout";
import ResidentDashboard from "./features/resident/pages/ResidentDashboard";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import { ErrorBoundary } from "./components/ui/error-boundary";

const LandingPage = lazy(() => import("./features/landing/pages/LandingPage"));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" aria-label="Loading"></div>
              <p className="text-sm text-gray-600">Loading application...</p>
            </div>
          </div>
        }>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Resident Routes */}
          <Route path="/resident" element={<ResidentLayout />}>
            <Route index element={<ResidentDashboard />} />
            {/* Add more resident routes here */}
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* Add more admin routes here */}
          </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
