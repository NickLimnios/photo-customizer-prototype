import { Link } from "react-router-dom";

const Header = () => (
  <header className="bg-topbar shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-accent-bluegray">
        Photobook
      </Link>
      <Link
        to="/login"
        className="text-text-secondary hover:text-accent-bluegray"
      >
        Login
      </Link>
    </div>
  </header>
);

export default Header;
