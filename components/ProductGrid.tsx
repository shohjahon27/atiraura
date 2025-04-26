import { Product } from "@/sanity.types";
import Image from 'next/image';
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.length > 0 ? (
        products.map((product) => {
          const isOutOfStock = product.stock != null && product.stock <= 0;

          // 👇 Smart handling for createdAt or _createdAt
          const createdAtString = (product._createdAt || product._createdAt) ?? "";
          const createdAt = new Date(createdAtString);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const isNewProduct = createdAt > sevenDaysAgo;

          return (
            <div
              key={product._id}
              className={`group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                isOutOfStock ? "opacity-60" : ""
              }`}
            >
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

                {/* NEW badge with bounce animation */}
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
                  <p className="text-lg font-bold text-blue-600">
                    {product.price ? `so'm ${product.price.toFixed(0)}` : "Narxi belgilanmagan"}
                  </p>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <p className="col-span-full text-center text-gray-600">
          Mahsulotlar topilmadi.
        </p>
      )}
    </div>
  );
}
