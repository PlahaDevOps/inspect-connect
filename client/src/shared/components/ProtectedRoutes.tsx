 
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoutes({ children }: Props) {
  const location = useLocation();
 
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) { 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
