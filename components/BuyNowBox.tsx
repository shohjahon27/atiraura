"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useBasketStore from "@/sanity/lib/store";

export default function BuyNowBox({ productId, stock }: { productId: string; stock?: number | null }) {
  const router = useRouter();
  const { getItemCount } = useBasketStore();
  const quantity = getItemCount(productId);

  const handleBuyNow = () => {
    if (stock != null && stock <= 0) {
      toast.error("Siz mahsulotni xarid qila olmaysiz, stokda mavjud emas", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    if (quantity <= 0) {
      toast.error("Mahsulot sonini tanlang", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    router.push(`/basket?productId=${productId}&qty=${quantity}`);
  };

  return (
    <div className="space-y-3">
      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
        disabled={(stock != null && stock <= 0) || quantity <= 0}
      >
        Hoziroq xarid qilish
      </button>
    </div>
  );
}