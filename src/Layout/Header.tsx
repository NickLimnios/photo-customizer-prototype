import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CartButton } from "../Cart/CartButton";
import { LoginButton } from "../Auth/LoginButton";
import { useAuth } from "../Auth/AuthContext";

//todo: Enable in case we want to add more links
// const links = [
//   { label: "Home", to: "/" },
//   { label: "Create", to: "/editor" },
// ];

const Header = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-topbar shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 tablet:py-4 flex items-center relative">
        <Link to="/" className="text-xl font-bold text-accent-bluegray">
          Photobook
        </Link>
        <div className="ml-auto flex items-center">
          <CartButton />
          {/* Show menu items inline on desktop (md and up) */}
          <nav className="hidden md:flex items-center space-x-4 md:space-x-6 ml-4">
            {/* {links.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-accent-bluegray">
                {label}
              </Link>
            ))} */}
            {user && (
              <span
                className="max-w-[9rem] truncate text-text-secondary"
                title={user.email || undefined}
              >
                {user.email}
              </span>
            )}
            <LoginButton />
          </nav>
          {/* Burger menu icon on mobile only */}
          <button
            className="ml-2 md:hidden p-2 text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="absolute right-4 top-full mt-2 w-40 bg-surface shadow-lg rounded p-4 flex flex-col space-y-3 md:hidden">
            {/* {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="hover:text-accent-bluegray"
              >
                {label}
              </Link>
            ))} */}
            {user && (
              <span
                className="text-text-secondary truncate"
                title={user.email || undefined}
              >
                {user.email}
              </span>
            )}
            <LoginButton onClick={() => setMobileOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
