import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCart } from "./useCart";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export const CartButton: React.FC<Props> = ({
  onClick,
  variant = "default",
  size = "sm",
  className,
}) => {
  const { state } = useCart();
  const itemCount = state.items.length;

  const prevCount = useRef(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevCount.current !== itemCount && itemCount > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      prevCount.current = itemCount;
      return () => clearTimeout(timeout);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("relative", className)}
    >
      <Link to="/cart" onClick={onClick} className="flex items-center gap-2">
        <span className="relative flex items-center">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span
              className={cn(
                "absolute -right-2 -top-2 flex h-4 min-w-[1rem] translate-y-1/2 items-center justify-center rounded-full bg-destructive px-1 text-[0.65rem] font-semibold text-destructive-foreground transition-transform",
                animate ? "scale-110" : "",
              )}
            >
              {itemCount}
            </span>
          )}
        </span>
        <span>Cart</span>
      </Link>
    </Button>
  );
};
