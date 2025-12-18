'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getAllProducts } from '@/lib/sanity/products';
import ProductGrid from '@/components/ProductGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from "@/sanity.types";


export default function ProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <main className="min-h-screen px-0 md:px-12 lg:px-20 pb-12">
      <h1 className="text-3xl font-bold text-pink-600 mt-2 text-center">Barcha Maxsulotlar</h1>
      <Header />

      <input
        type="text"
        placeholder="Maxsulotlarni qidiring..."
        className="w-full p-2 border rounded mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="max-w-7xl mx-auto w-full py-8">
        {/* AnimatePresence handles fade-out of old products, fade-in new ones */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + searchQuery}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ProductGrid products={currentProducts} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap items-center">
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
    </main>
  );
}