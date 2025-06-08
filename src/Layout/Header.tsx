import { Link } from "react-router-dom";
import { CartButton } from "../Cart/CartButton";
import { LoginButton } from "../Auth/LoginButton";
import { useAuth } from "../Auth/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-topbar shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 tablet:py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-accent-bluegray">
          Photobook
        </Link>
        <div className="ml-auto flex items-center space-x-4 tablet:space-x-6">
          {user && <span className="text-text-secondary">{user.email}</span>}
          <CartButton />
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
