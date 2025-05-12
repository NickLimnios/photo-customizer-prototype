import { Link } from "react-router-dom";
import { ShoppingCart, LogIn } from "lucide-react";
import { useCart } from "../context/useCart";

const Header = () => {
  const { state } = useCart();
  const itemCount = state.items.length;

  return (
    <header className="bg-topbar shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-accent-bluegray">
          Photobook
        </Link>
        <div className="ml-auto flex items-center space-x-6">
          <Link
            to="/cart"
            className="relative flex items-center text-text-secondary hover:text-accent-bluegray"
          >
            <ShoppingCart className="w-5 h-5 mr-1" />
            {/* Cart Badge */}
            {itemCount > 0 && (
              <span className="absolute -bottom-1 -left-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span>Cart</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center text-text-secondary hover:text-accent-bluegray"
          >
            <LogIn className="w-5 h-5 mr-1" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
