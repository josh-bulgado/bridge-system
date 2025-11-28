import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<"resident" | "staff" | "admin">;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"
            aria-label="Loading"
          ></div>
          <p className="text-sm text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in page
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If user role is not in allowedRoles, redirect to their correct dashboard
  if (!allowedRoles.includes(user.role)) {
    // Redirect user to their appropriate dashboard based on their role
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the correct role
  return <>{children}</>;
}
