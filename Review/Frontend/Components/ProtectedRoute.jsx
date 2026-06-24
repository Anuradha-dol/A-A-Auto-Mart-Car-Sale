// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../auth";

export default function ProtectedRoute() {
  const { role } = getAuth();
  if (!role) return <Navigate to="/login" replace />;
  return <Outlet />;
}
