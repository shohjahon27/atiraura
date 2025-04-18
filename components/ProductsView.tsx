import { Category, Product } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelectorComponent } from "./ui/category-selector";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

const ProductsViewProps = ({ products, categories }: ProductsViewProps) => {
  return (
    <div className="flex flex-col">
      {/* categories */}
      <div className="w-full sm:w-[200px]">
        {/* Example usage of categories */}
        <CategorySelectorComponent categories={categories} />
      </div>

      {/* products */}
      <div className="max-w-7xl mx-auto w-full py-6">
        <ProductGrid products={products} />
    </div>

  </div>
  );
};

export default ProductsViewProps;