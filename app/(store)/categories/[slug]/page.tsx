"use client";

import ProductsView from "@/components/ProductsView";
import { Category, Product } from "@/sanity.types";

interface Props {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
}

export default function ProductsViewWrapper({
  products,
  featuredProducts,
  categories,
}: Props) {
  return (
    <ProductsView
      products={products}
      featuredProducts={featuredProducts}
      categories={categories}
    />
  );
}
