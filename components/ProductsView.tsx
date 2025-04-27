'use client';

import { useEffect, useState } from "react";
import { Product, Category } from "@/sanity.types";
import ProductGrid from "@/components/ProductGrid";
import Carusel1 from "@/components/carusel/carusel";
import { motion, AnimatePresence } from "framer-motion";

interface ProductsViewProps {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  featuredProductsLoading?: boolean;
  productsLoading?: boolean;
}

const PRODUCTS_PER_PAGE = 8;

const ProductsView = ({
  products,
  featuredProducts,
}: ProductsViewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const filteredProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const productsWithNewFlag = filteredProducts.map((product) => {
    const createdAt = new Date(product._createdAt).getTime();
    const now = Date.now();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    const isNew = now - createdAt < fourteenDays;
    return { ...product, isNew };
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationItems = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-0">
      {/* Featured Carousel */}
      <Carusel1 products={featuredProducts} />

      <h1 className="text-3xl font-bold text-gray-600 opacity-50 mt-2 text-center">
        Yaqinda qo‘shilgan Mahsulotlar
      </h1>

      {/* Product Grid with Animation */}
      <div className="max-w-7xl mx-auto w-full py-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ProductGrid products={productsWithNewFlag} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 pb-8 flex-wrap items-center">
          {getPaginationItems().map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={idx}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg text-sm border transition ${
                  currentPage === page
                    ? "bg-pink-600 text-white border-pink-600 font-bold shadow-md"
                    : "bg-white text-pink-600 border-pink-600 hover:bg-pink-100"
                }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={idx}
                className="px-3 py-2 text-gray-400 select-none"
              >
                ...
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsView;