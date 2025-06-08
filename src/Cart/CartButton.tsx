import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./useCart";

interface Props {
  onClick?: () => void;
}
export const CartButton: React.FC<Props> = ({ onClick }) => {
  const { state } = useCart();
  const itemCount = state.items.length;

  const prevCount = useRef(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevCount.current != itemCount && itemCount > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  return (
    <Link
      to="/cart"
      onClick={onClick}
      className="group relative flex items-center text-text-secondary hover:text-accent-bluegray"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 mr-1" />
        {itemCount > 0 && (
          <span
            className={`absolute -bottom-1 -left-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full 
              flex items-center justify-center 
              transform transition-transform duration-200 ease-out 
              group-hover:scale-110
              ${animate ? "scale-125" : ""}`}
          >
            {itemCount}
          </span>
        )}
      </div>
      <span>Cart</span>
    </Link>
  );
};
