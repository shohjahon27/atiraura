'use client';

import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { useWishlistStore } from "@/app/(store)/wishlistStore"; // Import Zustand store
// import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for toast

import { toast } from "react-hot-toast"; // <<< ADD THIS LINE

interface ProductGridProps {
  products: Product[];
  onAddToWishlist?: (productId: string) => void;
  onRemoveFromWishlist?: (productId: string) => void;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { items: wishlist, addItem, removeItem } = useWishlistStore();

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeItem(productId);
      toast.error('Sevimlilardan olib tashlandi😢');
    } else {
      addItem(productId);
      toast.success('Sevimlilarga qo‘shildi');
    }
  };


  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.length > 0 ? (
        products.map((product) => {
          const isOutOfStock = product.stock != null && product.stock <= 0;

          const createdAtString = (product._createdAt || product._createdAt) ?? "";
          const createdAt = new Date(createdAtString);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const isNewProduct = createdAt > sevenDaysAgo;

          return (
            <div
              key={product._id}
              className={`group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative ${
                isOutOfStock ? "opacity-60" : ""
              }`}
            >
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white shadow-md hover:scale-110 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    isInWishlist(product._id) ? "fill-pink-500" : "fill-none"
                  } stroke-pink-500`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 
                    4 0 115.656 5.656L12 21.657l-8.828-8.829a4 4 0 010-5.656z"
                  />
                </svg>
              </button>

              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden">
                {product.image?.asset?._ref ? (
                  <Image
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    src={imageUrl(product.image.asset._ref).width(600).height(400).url()}
                    alt={product.name || "Product Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Rasm yo‘q</span>
                  </div>
                )}

                {/* NEW badge */}
                {isNewProduct && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                    Yangi
                  </div>
                )}

                {/* OUT OF STOCK overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black opacity-60">
                    <span className="text-white text-3xl font-bold">TUGADI</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <Link href={`/product/${product.slug?.current ?? "#"}`}>
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {product.description
                      ?.map((block) =>
                        block._type === "block"
                          ? block.children?.map((child) => child.text).join("")
                          : ""
                      )
                      .join("") || "Izoh mavjud emas"}
                  </p>

                  {/* STOCK AVAILABLE */}
                  <p className="text-sm text-gray-500">
                    {product.stock != null && product.stock > 0
                      ? `Omborda ${product.stock} dona`
                      : "Omborda mavjud emas"}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                     {product.price ? `so'm ${Math.round(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}` : "Narxi belgilanmagan"}
                  </p>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <p className="col-span-full text-center text-gray-600">Mahsulotlar topilmadi.</p>
      )}
    </div>
  );
}
