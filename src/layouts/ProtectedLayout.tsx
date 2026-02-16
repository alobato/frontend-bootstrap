import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { use100vh } from "react-div-100vh";
import { useNavigate } from "react-router";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const height = use100vh();
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 overflow-hidden">
      <div style={{ height: height ?? "100vh" }}>
        <div className="flex h-[40px] items-center justify-between border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            <div>{user?.email}</div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="flex grow" style={{ height: height ? height - 40 : "calc(100vh - 40px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
