import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./features/auth/pages/SignInPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import { EmailConfirmationPage } from "./features/auth/pages/EmailConfirmationPage";
import VerifyOTPPage from "./features/auth/pages/VerifyOTPPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/pages/ResetPasswordPage";
import CompleteGoogleProfilePage from "./features/auth/pages/CompleteGoogleProfilePage";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { VerifiedRoute } from "./components/VerifiedRoute";

// Lazy load layouts and pages
const ResidentLayout = lazy(
  () => import("./features/resident/layout/ResidentLayout"),
);
const AdminLayout = lazy(() => import("./features/admin/layout/AdminLayout"));
const StaffLayout = lazy(() => import("./features/staff/layout/StaffLayout"));

// Lazy load individual pages
const ResidentDashboard = lazy(
  () => import("./features/resident/pages/ResidentDashboardRedesigned"),
);
const AdminDashboard = lazy(
  () => import("./features/admin/pages/AdminDashboard"),
);
const StaffDashboard = lazy(
  () => import("./features/staff/pages/StaffDashboard"),
);
const VerificationPage = lazy(
  () => import("./features/resident/pages/VerificationPage"),
);
const ResidentManagementPage = lazy(
  () => import("./features/resident/pages/ResidentManagementPage"),
);
const ResidentDocumentRequestPage = lazy(
  () => import("./features/resident/pages/DocumentRequestPage"),
);
const CreateDocumentRequestPage = lazy(
  () => import("./features/resident/pages/CreateDocumentRequestPage"),
);
const DocumentRequestDetailPage = lazy(
  () => import("./features/resident/pages/DocumentRequestDetailPage"),
);
const StaffManagementPage = lazy(
  () => import("./features/staff/pages/StaffManagementPage"),
);
const DocumentRequestPage = lazy(
  () => import("./features/document/pages/DocumentRequestPage"),
);
const DocumentManagementPage = lazy(
  () => import("./features/document/pages/DocumentManagementPage"),
);

const BarangayConfigPage = lazy(
  () => import("./features/admin/pages/BarangayConfigPage"),
);

// Lazy load the landing page
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
            <Route
              path="/resident"
              element={
                <ProtectedRoute allowedRoles={["resident"]}>
                  <ResidentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ResidentDashboard />} />
              <Route path="verify" element={<VerificationPage />} />
              <Route path="verification" element={<VerificationPage />} />
              <Route
                path="requests"
                element={
                  <VerifiedRoute>
                    <ResidentDocumentRequestPage />
                  </VerifiedRoute>
                }
              />
              <Route
                path="new-requests"
                element={
                  <VerifiedRoute>
                    <CreateDocumentRequestPage />
                  </VerifiedRoute>
                }
              />
              <Route
                path="requests/:id"
                element={
                  <VerifiedRoute>
                    <DocumentRequestDetailPage />
                  </VerifiedRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route
                path="resident-management"
                element={<ResidentManagementPage />}
              />
              <Route
                path="staff-management"
                element={<StaffManagementPage />}
              />
              <Route path="doc-requests" element={<DocumentRequestPage />} />
              <Route
                path="config/document"
                element={<DocumentManagementPage />}
              />
              <Route path="config/barangay" element={<BarangayConfigPage />} />
            </Route>

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route
                path="resident-management"
                element={<ResidentManagementPage />}
              />
              <Route path="doc-requests" element={<DocumentRequestPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
