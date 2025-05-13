import { Link } from "react-router-dom";
import { CartButton } from "../Cart/CartButton";
import { LoginButton } from "../Auth/LoginButton";

const Header = () => {
  return (
    <header className="bg-topbar shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-accent-bluegray">
          Photobook
        </Link>
        <div className="ml-auto flex items-center space-x-6">
          <CartButton />
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
