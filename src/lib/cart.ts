export const CART_KEY = "photobook-cart-v1";

export type CartItem = {
  id: string;
  title: string;
  cover: string;
  pages: number;
  style: "minimal" | "classic" | "playful";
  size: "8x8" | "10x10" | "A4";
  paper: "Matte" | "Glossy";
  qty: number;
  unitPrice: number; // cents
};

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function calculateUnitPrice(
  pages: number,
  size: CartItem["size"],
  paper: CartItem["paper"],
): number {
  let base = 1999; // $19.99 base
  const perPage = 75; // $0.75 per page
  if (size === "10x10") base += 700;
  if (size === "A4") base += 500;
  if (paper === "Glossy") base += 300;
  return base + Math.max(0, pages - 16) * perPage;
}

export function addToCart(
  partial: Omit<CartItem, "id" | "unitPrice"> & {
    id?: string;
    unitPrice?: number;
  },
) {
  const items = getCart();
  const unitPrice =
    typeof partial.unitPrice === "number"
      ? partial.unitPrice
      : calculateUnitPrice(partial.pages, partial.size, partial.paper);
  const id =
    partial.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const existingIndex = items.findIndex(
    (item) =>
      item.title === partial.title &&
      item.size === partial.size &&
      item.paper === partial.paper &&
      item.pages === partial.pages &&
      item.style === partial.style,
  );

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      qty: items[existingIndex].qty + partial.qty,
    };
  } else {
    items.unshift({
      id,
      title: partial.title,
      cover: partial.cover,
      pages: partial.pages,
      style: partial.style,
      size: partial.size,
      paper: partial.paper,
      qty: partial.qty,
      unitPrice,
    });
  }

  setCart(items);
}
