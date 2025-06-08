import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "./AuthContext";

export const LoginButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <button
        onClick={async () => {
          await signOut();
          navigate("/");
        }}
        className="flex items-center text-text-secondary hover:text-accent-bluegray"
      >
        <LogOut className="w-5 h-5 mr-1" />
        <span>Logout</span>
      </button>
    );
  }

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
