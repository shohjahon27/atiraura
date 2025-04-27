import { create } from "zustand";

type WishlistState = {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setItems: (items: string[]) => void; // Add setItems method
};

export const useWishlistStore = create<WishlistState>((set) => ({
  items: typeof window !== "undefined" && localStorage.getItem("wishlist")
    ? JSON.parse(localStorage.getItem("wishlist") as string)
    : [],
  addItem: (id) => {
    set((state) => {
      const updatedItems = [...state.items, id];
      localStorage.setItem("wishlist", JSON.stringify(updatedItems));
      return { items: updatedItems };
    });
  },
  removeItem: (id) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item !== id);
      localStorage.setItem("wishlist", JSON.stringify(updatedItems));
      return { items: updatedItems };
    });
  },
  setItems: (items) => {
    set(() => {
      localStorage.setItem("wishlist", JSON.stringify(items));
      return { items };
    });
  },
}));