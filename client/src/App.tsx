import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./features/auth/pages/SignInPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ResidentLayout from "./features/resident/layout/ResidentLayout";
import AdminLayout from "./features/admin/layout/AdminLayout";
import ResidentDashboard from "./features/resident/pages/ResidentDashboard";
import AdminDashboard from "./features/admin/pages/AdminDashboard";

const LandingPage = lazy(() => import("./features/landing/pages/LandingPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
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
  );
}

export default App;
