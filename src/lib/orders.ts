import type { CartItem } from "./cart";

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  status: "processing" | "completed";
  createdAt: string;
};

export const ORDERS_KEY = "photobook-orders-v1";

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  try {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("orders:updated"));
  } catch {
    // no-op if storage fails
  }
}
