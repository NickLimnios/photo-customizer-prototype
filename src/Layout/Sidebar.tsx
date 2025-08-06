import React from "react";
import { CartButton } from "../Cart/CartButton";
import { LoginButton } from "../Auth/LoginButton";
import { useAuth } from "../Auth/AuthContext";

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-48 bg-surface p-4 flex flex-col space-y-4">
      <CartButton />
      {user && (
        <span
          className="text-sm text-text-secondary break-all"
          title={user.email || undefined}
        >
          {user.email}
        </span>
      )}
      <LoginButton />
    </aside>
  );
};

export default Sidebar;
