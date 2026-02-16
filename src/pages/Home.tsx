import { Link } from "react-router";

import { useAuth } from "../contexts/AuthContext";

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome</h1>
        <p className="mb-8 text-xl text-gray-600">Modern React + Apollo bootstrap with protected routes.</p>

        {isAuthenticated ? (
          <p className="text-lg text-green-600">
            Logged in as: <strong>{user?.name}</strong>
          </p>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
