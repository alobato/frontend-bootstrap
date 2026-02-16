import type { ReactNode } from "react";

export function NotProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-lg font-medium text-gray-900">Public Area</h2>
      <p className="text-sm text-gray-600">This area does not require authentication.</p>
      {children}
    </div>
  );
}
