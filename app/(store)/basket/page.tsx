"use client";

import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/sanity/lib/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../loading";
// import { createCheckoutSession } from "@/actions/createCheckoutSession"; // Stripe
import { createClickCheckout } from "@/actions/createClickCheckout"; // Click.uz - FIXED: removed duplicate

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"click" | "stripe">("click"); // Default to Click

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader/>;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Savatingiz</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Savatingizda hech nima yuq.</p>
      </div>
    );
  }

const handleCheckout = async () => {
    if (!isSignedIn) {
        setIsLoading(true);
        // Handle sign-in logic if needed, then return
        return;
    }
    try {
        setIsLoading(true);
        const metadata = {
            orderNumber: crypto.randomUUID(),
            customerName: user?.fullName ?? "Unknown",
            customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
            clerkUserId: user!.id,
        };
        // Use ONLY Click.uz
        const checkoutUrl = await createClickCheckout(groupedItems, metadata);
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
    } catch (error) {
        console.error("Error creating checkout session:", error);
        alert("To'lov tizimida xatolik. Iltimos, keyinroq urinib ko'ring.");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-900 dark:text-white">Savatingiz</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List - Takes 2/3 on desktop */}
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
                    Narx: {((item.product.price ?? 0) * item.quantity).toFixed(2)} sum
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Panel - Takes 1/3 on desktop, fixed on mobile */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 bg-white dark:bg-gray-800 p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Buyurtma xulosasi</h3>
            
            {/* Payment Method Selector */}
            <div className="mb-4">
              <p className="font-medium mb-2">Tulov usuli:</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="click"
                    checked={paymentMethod === "click"}
                    onChange={() => setPaymentMethod("click")}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Click.uz</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uzcard, Humo, mobil hisob orqali
                    </p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Stripe (Xalqaro)</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visa, Mastercard
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>Mahsulotlar:</span>
                <span>
                  {groupedItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </p>
              <p className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Jami:</span>
                <span>
                  {useBasketStore.getState().getTotalPrice().toFixed(2)} sum
                </span>
              </p>
            </div>

            {/* Checkout Button */}
            {isSignedIn ? (
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Yuklanmoqda..." : 
                  paymentMethod === "click" ? 
                  "Click.uz orqali to'lash" : 
                  "Stripe orqali to'lash"}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
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