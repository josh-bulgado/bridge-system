import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFetchResidentById } from "@/features/staff/hooks";

interface VerifiedRouteProps {
  children: React.ReactNode;
}

/**
 * Route wrapper that ensures the resident is verified before allowing access
 * Redirects to dashboard if not verified
 */
export function VerifiedRoute({ children }: VerifiedRouteProps) {
  const { data: user } = useAuth();
  const { data: residentData, isLoading } = useFetchResidentById(user?.residentId || "");
  const location = useLocation();

  // Show loading spinner while checking verification status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"
            aria-label="Loading"
          ></div>
          <p className="text-sm text-gray-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // If not verified, redirect to dashboard
  if (!residentData?.isEmailVerified) {
    return <Navigate to="/resident" state={{ from: location }} replace />;
  }

  // User is verified, allow access
  return <>{children}</>;
}
