import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { CartButton } from "../Cart/CartButton";
import { LoginButton } from "../Auth/LoginButton";
import { useAuth } from "../Auth/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Templates", to: "/templates" },
  { label: "Editor", to: "/editor" },
  { label: "Orders", to: "/orders" },
];

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-br from-primary to-fuchsia-500 bg-clip-text text-transparent">
            LumiBook
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "transition-colors hover:text-primary",
                isActive(link.to)
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user?.email && (
            <span className="hidden md:inline text-sm text-muted-foreground">
              {user.email}
            </span>
          )}
          <LoginButton className="hidden sm:inline-flex" />
          <CartButton className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-4 py-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isActive(link.to)
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user?.email && (
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Signed in as {user.email}
              </span>
            )}
            <LoginButton
              variant="ghost"
              className="justify-start"
              onClick={() => setMobileOpen(false)}
            />
            <CartButton
              variant="outline"
              className="justify-start"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
