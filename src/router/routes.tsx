import { Navigate, createBrowserRouter } from "react-router";

import { AdminLayout } from "@/layouts/AdminLayout";
import { RootLayout } from "@/layouts/RootLayout";
import { DashboardPage } from "@/pages/admin/Dashboard";
import { AuthorsPage } from "@/pages/admin/Authors";
import { BooksPage } from "@/pages/admin/Books";
import { CategoriesPage } from "@/pages/admin/Categories";
import { PublishersPage } from "@/pages/admin/Publishers";
import { LoginPage } from "@/pages/Login";
import { NotFoundPage } from "@/pages/NotFound";
import { NotLoggedRoute } from "./NotLoggedRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin" replace />,
      },
      {
        path: "login",
        element: (
          <NotLoggedRoute>
            <LoginPage />
          </NotLoggedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "authors",
            element: <AuthorsPage />,
          },
          {
            path: "books",
            element: <BooksPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
          {
            path: "publishers",
            element: <PublishersPage />,
          },
        ],
      },
    ],
  },
]);
