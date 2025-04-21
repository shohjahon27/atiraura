"use client";

import { Category } from "@/sanity.types";
import { Product } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
// import { CategorySelectorComponent } from "./ui/category-selector";
import Carusel1 from "./carusel/carusel";

interface ProductsViewProps {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  featuredProductsLoading?: boolean;
  productsLoading?: boolean;
}

const ProductsView = ({ products, featuredProducts, }: ProductsViewProps) => {
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-0">
      {/* Carousel with featured products */}
      <Carusel1 products={featuredProducts} />

      {/* Categories */}
        <h1 className="text-3xl font-bold text-gray-600 opacity-50 mt-2 text-center">yaqinda qushilgan maxsulotlar</h1>
        {/* <CategorySelectorComponent categories={categories} /> */}

      {/* All Products */}
      <div className="max-w-7xl mx-auto w-full py-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default ProductsView;