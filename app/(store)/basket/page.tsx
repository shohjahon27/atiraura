// app/(store)/basket/page.tsx (or wherever this file is)

"use client";

import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/sanity/lib/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../loading";
import { handleCheckout } from "@/app/(store)/checkout/client-actions"; // ← GOOD ONE
import type { CartItem } from "@/app/(store)/checkout/types";

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Savatingiz</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Savatingizda hech nima yuq.</p>
      </div>
    );
  }

  // Convert groupedItems to CartItem format for handleCheckout
  const cartItems: CartItem[] = groupedItems.map((item) => ({
    product: {
      _id: item.product._id,
      name: item.product.name ?? "Unknown",
      price: item.product.price ?? 0,
    },
    quantity: item.quantity,
  }));

  const total = useBasketStore.getState().getTotalPrice();

  const onCheckout = async () => {
    if (!isSignedIn || !user) {
      alert("To'lov qilish uchun tizimga kirishingiz kerak.");
      return;
    }

    setIsLoading(true);

    try {
      await handleCheckout(cartItems, total, {
        name: user.fullName ?? "Unknown",
        phone: user.phoneNumbers[0]?.phoneNumber ?? "+998", // fallback, better to have phone input
        email: user.emailAddresses[0]?.emailAddress,
        address: undefined,
      });
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("To'lov tizimida xatolik. Iltimos, keyinroq urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-900 dark:text-white">Savatingiz</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {groupedItems?.map((item) => (
            <div
              key={item.product._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 transition-transform duration-200 hover:scale-[1.01]"
            >
              <div
                className="flex items-center w-full sm:w-auto cursor-pointer"
                onClick={() => router.push(`/product/${item.product.slug?.current}`)}
              >
                <div className="w-24 h-24 flex-shrink-0 mr-4">
                  {item.product.image && (
                    <Image
                      src={item.product.image?.asset?._ref ? imageUrl(item.product.image.asset._ref).url() : ""}
                      alt={item.product.name ?? "Product image"}
                      className="w-full h-full object-cover rounded-lg border"
                      width={96}
                      height={96}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {item.product.name}
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    Narx: {((item.product.price ?? 0) * item.quantity).toLocaleString()} sum
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 bg-white dark:bg-gray-800 p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Buyurtma xulosasi</h3>

            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>Mahsulotlar:</span>
                <span>{groupedItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </p>
              <p className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Jami:</span>
                <span>{total.toLocaleString()} sum</span>
              </p>
            </div>

            {isSignedIn ? (
              <button
                onClick={onCheckout}
                disabled={isLoading}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-4 rounded-lg font-bold disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Yuklanmoqda..." : "CLICK bilan to'lash"}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-4 rounded-lg font-bold transition-colors">
                  Tulash uchun kirish
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketPage;