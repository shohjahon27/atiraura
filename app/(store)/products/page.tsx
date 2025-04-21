'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header'; // adjust if needed
import ProductThumb from '@/components/ProductThumb'; // adjust path if needed
import { getProducts } from "@/sanity/lib/client"; // adjust path to the correct file where getProducts is exported


export default function ProductsPage() {
  interface Product {
    _id: string;
    name: string;
    _type: "product";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    // Add other fields as needed
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  
  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await getProducts();
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
  }, [searchQuery, products]);

  return (
    <main className=" min-h-screen px-4 md:px-12 lg:px-20 pb-12">
      <h1 className="text-3xl font-bold text-pink-600 mt-2 text-center">Barcha Maxsulotlar</h1>
      <Header />

      <input
        type="text"
        placeholder="maxsulotlarni qidiring..."
        className="w-full p-2 border rounded mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filteredProducts.map((product) => (
          <ProductThumb key={product._id} product={product } />
        ))}
      </div>
    </main>
  );
}
