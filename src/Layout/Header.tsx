import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-topbar shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 tablet:py-4 flex items-center">
        <Link to="/" className="text-xl font-bold text-accent-bluegray">
          Photobook
        </Link>
      </div>
    </header>
  );
};

export default Header;
