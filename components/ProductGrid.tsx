"use client";

import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-600">No products available</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const imageSrc = product.image
          ? typeof product.image === "string"
            ? product.image
            : product.image.asset?._ref
            ? imageUrl(product.image.asset._ref).url()
            : "/fallback-image.jpg"
          : "/fallback-image.jpg";
        const isOutOfStock = product.stock === 0;

        console.log(`ProductGrid - Product ${product.name}: stock=${product.stock}, isOutOfStock=${isOutOfStock}`);

        return (
          <Link key={product._id} href={`/product/${product.slug?.current ?? "unknown-product"}`}>
            <div
              className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${
                isOutOfStock ? "opacity-60" : ""
              }`}
            >
              <div className="relative w-full h-48">
                <Image
                  src={imageSrc}
                  alt={product.name || "Product image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={() => console.error(`Failed to load image for ${product.name}`)}
                />
                {isOutOfStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Tugadi
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-medium">
                  {product.price ? product.price.toLocaleString("uz-UZ") : "N/A"} UZS
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}