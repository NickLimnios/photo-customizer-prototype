import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";

import { useAuth } from "./AuthContext";
import { Button, type ButtonProps } from "@/components/ui/button";

interface Props {
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export const LoginButton: FC<Props> = ({
  onClick,
  variant = "ghost",
  size = "sm",
  className,
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={async () => {
          await signOut();
          navigate("/");
          onClick?.();
        }}
      >
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link to="/login" onClick={onClick} className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        <span>Log in</span>
      </Link>
    </Button>
  );
};
