import { createContext } from "react";
import { CartItem } from "../types/CartItem";

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export default CartContext;
export type { CartState, Action };
