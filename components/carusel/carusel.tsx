"use client";

import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types"; // Import Product type from sanity.types.ts

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/a11y";
import "swiper/css/pagination";

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
    <div className="container mx-auto px-2 sm:px-6 py-2 bg-white-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-600 opacity-50 mb-6 text-center">
        Tanlangan Parfyumlar
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 1200,
          disableOnInteraction: false,
        }}
        className="w-full h-auto min-h-[300px]"
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 12 },
          640: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        onSwiper={(swiper) => console.log("Swiper initialized:", swiper)}
        onSlideChange={() => console.log("Slide changed")}
      >
        {products.map((product) => {
          const imageSrc = product.image?.asset
            ? imageUrl(product.image.asset._ref).url()
            : "/fallback-image.jpg";
          const isOutOfStock = (product.stock ?? 0) === 0;
          const productName = product.name ?? "Unnamed Product";
          const productPrice = product.price ?? 0;
          const productSlug = product.slug?.current ?? "";

          return (
            <SwiperSlide key={product._id}>
              <Link href={`/product/${productSlug}`}>
                <div
                  className={`bg-white rounded-xl shadow-lg overflow-hidden 
                  h-[380px] sm:h-[420px] lg:h-[500px] flex flex-col 
                  transition-transform duration-300 hover:scale-[1.02]
                  ${isOutOfStock ? "opacity-60" : ""}`}
                >
                  {/* Image Section */}
                  <div className="relative w-full h-2/3 min-h-[220px]">
                    <Image
                      src={imageSrc}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      onError={() =>
                        console.error(`Failed to load image for ${productName}`)
                      }
                    />
                    {isOutOfStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Tugadi
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                      {productName}
                    </h3>
                    <p className="text-pink-600 font-semibold text-sm sm:text-base mb-4">
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
