import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CartButton } from "../Cart/CartButton";
import { LoginButton } from "../Auth/LoginButton";
import { useAuth } from "../Auth/AuthContext";

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
          <div className="hidden tablet:flex items-center space-x-4 tablet:space-x-6 ml-4">
            {user && (
              <span
                className="max-w-[9rem] truncate text-text-secondary"
                title={user.email || undefined}
              >
                {user.email}
              </span>
            )}
            <LoginButton />
          </div>
          <button
            className="ml-2 tablet:hidden p-2 text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="absolute right-4 top-full mt-2 w-40 bg-surface shadow-lg rounded p-4 flex flex-col space-y-3 tablet:hidden">
            {user && (
              <span className="text-text-secondary truncate" title={user.email || undefined}>
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
