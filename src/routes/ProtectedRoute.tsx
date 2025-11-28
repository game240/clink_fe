import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { PropsWithChildren } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>로딩 중…</p>;
  }
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
}
