import BlackFridayBanner from "@/components/BlackFridayBanner";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getFeaturedProducts } from "@/sanity/lib/products/getFeaturedProducts";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function StorePage() {
  const products = await getAllProducts();
  const featuredProducts = await getFeaturedProducts();
  const categories = await getAllCategories();

  console.log("StorePage products:", products);
  console.log("StorePage featured products:", featuredProducts);

  return (
    <div>
      <BlackFridayBanner />

      <ProductsView
        products={products}
        featuredProducts={featuredProducts}
        categories={categories}
      />
    </div>
  );
}