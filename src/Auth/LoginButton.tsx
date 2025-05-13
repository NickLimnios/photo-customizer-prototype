import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export const LoginButton = () => {
  return (
    <Link
      to="/login"
      className="flex items-center text-text-secondary hover:text-accent-bluegray"
    >
      <LogIn className="w-5 h-5 mr-1" />
      <span>Login</span>
    </Link>
  );
};
