// src/components/users/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  roles?: number[];
  unauthorizedTo?: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
};

export default function ProtectedRoute({
  roles,
  unauthorizedTo,
  fallback = <p>Loading…</p>,
  children,
}: Props) {
  const location = useLocation();
  const { user, authToken, loading, role } = useAuth();

  const isAuthed = !!authToken && !!user;

  if (loading) return <>{fallback}</>;

  if (!isAuthed) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // role guard (if roles prop provided)
  if (roles?.length) {
    const userRole = Number(user?.role ?? role);
    const hasAny = roles.includes(userRole);
    if (!hasAny) {
      const defaultByRole =
        userRole === 0 ? "/admin/dashboard" :
        userRole === 1 ? "/client/dashboard" :
        userRole === 2 ? "/" : "/inspector/dashboard";
      const redirectTo = unauthorizedTo ?? defaultByRole;
      return <Navigate to={redirectTo} replace />;
    }
  }
 
  return children ? <>{children}</> : <Outlet />;
}
