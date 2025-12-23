"use client";

import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/sanity/lib/store";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../loading";
import Link from "next/link";

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Loader />;

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Savatingiz</h1>
        <p className="text-gray-600">Savatingizda hech nima yo‘q.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Savatingiz</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRODUCTS */}
        <div className="lg:col-span-2 space-y-4">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                {item.product.image && item.product.image.asset && (
                  <Image
                    src={imageUrl(item.product.image.asset._ref).url()}
                    alt={item.product.name ?? "Product"}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                )}
                <div>
                  <h2 className="font-semibold">{item.product.name}</h2>
                  <p>
                    {(item.product.price ?? 0) * item.quantity} sum
                  </p>
                </div>
              </div>

              <AddToBasketButton product={item.product} />
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white p-6 border rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Buyurtma xulosasi</h3>

            <p className="flex justify-between">
              <span>Mahsulotlar:</span>
              <span>
                {groupedItems.reduce((t, i) => t + i.quantity, 0)}
              </span>
            </p>

            <p className="flex justify-between text-2xl font-bold mt-4">
              <span>Jami:</span>
              <span>
                {useBasketStore.getState().getTotalPrice().toFixed(2)} sum
              </span>
            </p>

            {isSignedIn ? (
<Link
  href="/checkout"
  className="w-full bg-blue-600 text-white py-3 rounded text-center block"
>
  Buyurtmani rasmiylashtirish
</Link>


            ) : (
              // <SignInButton mode="modal">
                <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded">
                  Tulash uchun kirish
                </button>
              // </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketPage;
