"use client";

import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/sanity/lib/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../loading";
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";


function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

// wait for the client to mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Loader/>
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
        return setIsLoading(true);
    }
    try {
        const metadata: Metadata = {
          orderNumber: crypto.randomUUID(), // example: ab3lks-asllks-k5sljs-lksj0f
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
          clerkUserId: user!.id,
        };
      
        const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      } finally {
        setIsLoading(false);
      }
    }      

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-900 dark:text-white">Your Basket</h1>
      <div className="grid grid-cols-1 gap-6">
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
                  Price: £{((item.product.price ?? 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
              <AddToBasketButton product={item.product} />
            </div>
          </div>
        ))}
        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded
        order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
            <h3 className="text-xl font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>jami:</span>
              <span>
                sum {useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>

          {/* if user is not signed in button pop up to sign in  */}
          {isSignedIn ? (
          <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
  >
          {isLoading ? "Processing..." : "Checkout"}
          </button>
) : (
          <SignInButton mode="modal">
          <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Sign in to Checkout
         </button>
        </SignInButton>
)}
          </div>
        <div className="h-64 lg:h-0">
          {/* spacer for fixed checkout on mobile */}
        </div>
      </div>
    </div>
  );
}

export default BasketPage;