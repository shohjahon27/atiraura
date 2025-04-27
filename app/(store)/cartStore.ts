import { create } from "zustand";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: typeof window !== "undefined" && localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") as string)
    : [],
  addItem: (productId, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === productId);
      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { productId, quantity }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return { items: updatedItems };
    });
  },
  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.productId !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return { items: updatedItems };
    });
  },
  clearCart: () => {
    set(() => {
      localStorage.setItem("cart", JSON.stringify([]));
      return { items: [] };
    });
  },
}));