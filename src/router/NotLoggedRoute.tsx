import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "@/contexts/AuthContext";

interface NotLoggedRouteProps {
  children: ReactNode;
}

export function NotLoggedRoute({ children }: NotLoggedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading account state...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
