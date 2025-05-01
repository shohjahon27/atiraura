import AddToBasketButton from "@/components/AddToBasketButton";
import BuyNowBox from "@/components/BuyNowBox";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { getRelatedProducts } from "@/sanity/lib/products/getRelatedProducts";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle, ShieldCheck } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import { getReviewsByProduct } from "@/sanity/lib/products/getReviewsByProduct";



export const dynamic = "force-static";
export const revalidate = 60;

async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const relatedProducts = await getRelatedProducts(product.tags || null, slug);
  const reviews = await getReviewsByProduct(product._id);

  const isOutOfStock = product.stock != null && product.stock <= 0;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  // Fetch reviews for the product


  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image */}
        <div className="col-span-1">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow">
            {product.image && (
              <Image
                src={imageUrl(product.image).url()}
                alt={product.name ?? "Product image"}
                fill
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50">
                <span className="text-white text-4xl font-semibold">TUGADI</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Description */}
        <div className="col-span-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="text-lg text-gray-700 mb-4">
              {Array.isArray(product.description) && (
                <PortableText value={product.description} />
              )}
            </div>
          </div>
        </div>

        {/* Right: Purchase Card */}
        <div className="col-span-1">
          <div className="border rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Yetkazib beruvchi</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Sifat kafolati & tez yetkazib berish
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Omborda mavjud — <span className="font-medium text-red-800">{product.stock} dona</span>
            </div>


            <div className="text-2xl font-bold text-red-500">
              {product.price.toLocaleString()} so‘m
              {discount > 0 && (
                <span className="ml-2 text-base line-through text-gray-400">
                  {product.originalPrice?.toLocaleString()} so‘m
                </span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-green-600 font-semibold text-sm">
                Chegirma: {discount}%
              </div>
            )}

            <AddToBasketButton product={product} disabled={isOutOfStock} />

            <BuyNowBox productId={product._id} stock={product.stock} />
          </div>
        </div>
      </div>
            {/* Review Section */}
            <div className="mt-12">
        <ReviewList reviews={reviews} />
        <ReviewForm productId={product._id} />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Boshqa mahsulotlar</h2>
          <ProductGrid products={relatedProducts} />
        </div>
        
      )}

    </div>
  );
}

export async function generateStaticParams() {
  const query = groq`*[_type == "product"] { slug { current } }`;
  const products = await client.fetch<{ slug: { current: string } }[]>(query);
  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Atiraura",
    };
  }

  return {
    title: `${product.name} | Atiraura`,
    description: Array.isArray(product.description)
      ? product.description.join(" ")
      : "Explore this product at Atiraura.",
  };
}

export default ProductPage;