"use client";

import { useEffect, useState } from "react";
import { Product } from "@/sanity.types";
import useBasketStore from "@/sanity/lib/store";
import { toast } from "react-hot-toast";

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToBasketButton({ product, disabled }: AddToBasketButtonProps) {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  const itemCount = getItemCount(product._id);

  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering to prevent hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddItem = () => {
    if (product.stock != null && itemCount >= product.stock) {
      toast.error("Stokda yetarli mahsulot yo'q!", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    addItem(product);
    toast.success(`Mahsulot soni oshirildi: ${itemCount + 1}`, {
      position: "top-right",
      duration: 3000,
    });
  };

  const handleRemoveItem = () => {
    if (itemCount > 0) {
      removeItem(product._id);
    } else {
      toast.error("Siz mahsulot sonini tanlamadingiz", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleRemoveItem}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          itemCount === 0
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        disabled={itemCount === 0 || disabled}
      >
        <span
          className={`text-xl font-bold ${
            itemCount === 0 ? "text-gray-400" : "text-gray-600"
          }`}
        >
          –
        </span>
      </button>

      <span className="w-8 text-center font-semibold">{itemCount}</span>

      <button
        onClick={handleAddItem}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={disabled}
      >
        <span className="text-xl font-bold text-white">+</span>
      </button>
    </div>
  );
}

export default AddToBasketButton;