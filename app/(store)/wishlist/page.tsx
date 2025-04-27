'use client';

import { useEffect, useState } from "react";
import { getProductByIds } from "@/sanity/lib/products/getProductByIds";
import { Product } from "@/sanity.types";
import ProductGrid from "@/components/ProductGrid";
import { useWishlistStore } from "@/app/(store)/wishlistStore";
import useBasketStore from "@/sanity/lib/store";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { items: wishlist, setItems } = useWishlistStore();
  const addToBasket = useBasketStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch products based on wishlist IDs
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      if (wishlist.length > 0) {
        const fetchedProducts = await getProductByIds(wishlist);
        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }
      setLoading(false);
    };

    fetchWishlistProducts();
  }, [wishlist]);

  // Function to clear the wishlist
  const clearWishlist = () => {
    setItems([]);
  };

  // Function to add all wishlist items to basket and redirect to /basket
  const addAllToBasket = () => {
    products.forEach((product) => {
      addToBasket(product); // Add each product with quantity 1
    });
    router.push("/basket"); // Redirect to basket page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-500 font-light">Sevimli mahsulotlaringiz yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white-50 to-purple-50 py-10 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 drop-shadow-md font-[Pacifico] tracking-wide">
            Sevimli Mahsulotlar
          </h1>
          {wishlist.length > 0 && (
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <button
                onClick={clearWishlist}
                className="px-5 py-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Barchasini o`chirish
              </button>
              <button
                onClick={addAllToBasket}
                className="px-5 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                 savatga qo`shish
              </button>
            </div>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {products.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-pink-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.657l-8.828-8.829a4 4 0 010-5.656z"
              />
            </svg>
            <p className="text-xl text-gray-500 font-light">
              Sizning wishlist bo`sh 😢
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Sevimli mahsulotlaringizni qo`shing va ularni bu yerda saqlang!
            </p>
            <a
              href="/products"
              className="mt-4 px-6 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Mahsulotlarni ko`rish
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
