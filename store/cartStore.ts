import { create } from "zustand";

interface CartItem {
  id: string;
  type: "single" | "album"; // New field to differentiate item types
  imageData?: string; // For single image items
  albumData?: {
    pages: { id: string; imageSlots: { id: string; imageData?: string }[] }[];
  }; // For albums
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));
