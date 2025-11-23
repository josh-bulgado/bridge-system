import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./features/auth/pages/SignInPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
// AccountCreatedPage removed - users are redirected directly to email verification after registration
import { EmailConfirmationPage } from "./features/auth/pages/EmailConfirmationPage";
import VerifyOTPPage from "./features/auth/pages/VerifyOTPPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/pages/ResetPasswordPage";
import CompleteGoogleProfilePage from "./features/auth/pages/CompleteGoogleProfilePage";
import ResidentLayout from "./features/resident/layout/ResidentLayout";
import AdminLayout from "./features/admin/layout/AdminLayout";
import StaffLayout from "./features/staff/layout/StaffLayout";
import ResidentDashboard from "./features/resident/pages/ResidentDashboard";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import StaffDashboard from "./features/staff/pages/StaffDashboard";
import { StatCardDemo } from "./features/staff/components/StatCardDemo";
import { RequestCardDemo } from "./features/staff/components/RequestCardDemo";
import { RequestCardVariantsDemo } from "./features/staff/components/RequestCardVariantsDemo";
import PaymentVerification from "./features/staff/pages/PaymentVerification";
import DocumentGeneration from "./features/staff/pages/DocumentGeneration";
import StaffSidebarDemo from "./features/staff/pages/StaffSidebarDemo";
import { ErrorBoundary } from "./components/ui/error-boundary";
import VerificationPage from "./features/resident/pages/VerificationPage";
import StaffManagementPage from "./features/staff/pages/StaffManagementPage";
import ResidentManagementPage from "./features/resident/pages/ResidentManagementPage";
import BarangayConfigPage from "./features/admin/pages/BarangayConfigPage";
import DocumentManagementPage from "./features/document/pages/DocumentManagementPage";

const LandingPage = lazy(() => import("./features/landing/pages/LandingPage"));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"
                  aria-label="Loading"
                ></div>
                <p className="text-sm text-gray-600">Loading application...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* AccountCreatedPage route removed - users go directly to email verification */}
            <Route
              path="/email-confirmation"
              element={<EmailConfirmationPage />}
            />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/auth/complete-google-profile"
              element={<CompleteGoogleProfilePage />}
            />

            {/* Resident Routes */}
            <Route path="/resident" element={<ResidentLayout />}>
              <Route index element={<ResidentDashboard />} />
              <Route path="verify" element={<VerificationPage />} />
              <Route path="verification" element={<VerificationPage />} />
              {/* Add more resident routes here */}
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route
                path="resident-management"
                element={<ResidentManagementPage />}
              />
              <Route
                path="staff-management"
                element={<StaffManagementPage />}
              />
              <Route path="config/barangay" element={<BarangayConfigPage />} />
              <Route
                path="config/document"
                element={<DocumentManagementPage />}
              />
              {/* Add more admin routes here */}
            </Route>

            {/* Staff Routes */}
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<StaffDashboard />} />
              <Route
                path="resident-management"
                element={<ResidentManagementPage />}
              />
              <Route
                path="payment-verification"
                element={<PaymentVerification />}
              />
              <Route
                path="document-generation"
                element={<DocumentGeneration />}
              />
              <Route path="demo" element={<StatCardDemo />} />
              <Route path="request-demo" element={<RequestCardDemo />} />
              <Route
                path="variants-demo"
                element={<RequestCardVariantsDemo />}
              />
              <Route path="sidebar-demo" element={<StaffSidebarDemo />} />
              {/* Add more staff routes here */}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
