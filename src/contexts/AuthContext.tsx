import { useMutation, useQuery } from "@apollo/client/react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { LOGIN_MUTATION, LOGOUT_MUTATION } from "@/graphql/mutations";
import { ME_QUERY } from "@/graphql/queries";
import type { LoginMutationData, LoginMutationVariables, LogoutMutationData, QueryMeData, User } from "@/types/graphql";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function normalizeAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid email") || normalized.includes("invalid") || normalized.includes("credential")) {
    return "Invalid email and/or password.";
  }

  if (normalized.includes("forbidden") || normalized.includes("unauthor")) {
    return "You are not authorized to access this resource.";
  }

  return "Unable to authenticate with the server. Please try again.";
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const { data, loading: meLoading, refetch, client } = useQuery<QueryMeData>(ME_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const [loginMutation] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);
  const [logoutMutation] = useMutation<LogoutMutationData>(LOGOUT_MUTATION);

  useEffect(() => {
    setUser(data?.me ?? null);
  }, [data]);

  const login = async (email: string, password: string) => {
    try {
      await loginMutation({ variables: { email, password } });
      const result = await refetch();
      setUser(result.data?.me ?? null);
      return { success: true };
    } catch (error) {
      const fallbackMessage = error instanceof Error ? normalizeAuthError(error.message) : "Unexpected authentication error.";
      return { success: false, message: fallbackMessage };
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch {
      // Ignore API logout failure and still clear local state.
    } finally {
      setUser(null);
      await client.clearStore();
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isInitializing: meLoading,
      login,
      logout,
    }),
    [user, meLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
