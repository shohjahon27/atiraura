"use client";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types"; // Import Product type from sanity.types.ts

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface Carusel1Props {
  products: Product[];
}

export default function Carusel1({ products }: Carusel1Props) {
  console.log("Carusel1 products:", products);

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        No featured products available
      </div>
    );
  }

  return (
    <div className="container mx-auto px-16 py-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
        Tanlangan Parfyumlar
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="w-full h-auto min-h-[300px] rounded-lg"
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        onSwiper={(swiper) => console.log("Swiper initialized:", swiper)}
        onSlideChange={() => console.log("Slide changed")}
      >
        {products.map((product) => {
          // Handle optional fields with fallbacks
          const imageSrc = product.image?.asset
            ? imageUrl(product.image.asset._ref).url()
            : "/fallback-image.jpg";
          const isOutOfStock = (product.stock ?? 0) === 0;
          const productName = product.name ?? "Unnamed Product";
          const productPrice = product.price ?? 0;
          const productSlug = product.slug?.current ?? "";

          console.log(`Product ${productName}: stock=${product.stock ?? 0}, isOutOfStock=${isOutOfStock}`);

          return (
            <SwiperSlide key={product._id}>
              <Link href={`/product/${productSlug}`}>
                <div
                  className={`bg-white rounded-lg shadow-md overflow-hidden h-[360px] max-h-[360px] flex flex-col sm:h-[300px] ${
                    isOutOfStock ? "opacity-60" : ""
                  }`}
                >
                  <div className="relative w-full h-2/3">
                    <Image
                      src={imageSrc}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => console.error(`Failed to load image for ${productName}`)}
                    />
                    {isOutOfStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Tugadi
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {productName}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {productPrice.toLocaleString("uz-UZ")} UZS
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}