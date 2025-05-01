import { groq } from "next-sanity";
import { client } from "../client";
import { Product } from "@/sanity.types";

export async function getRelatedProducts(category: string, currentProductSlug: string, limit: number = 4): Promise<Product[]> {
  const query = groq`*[_type == "product" && category == $category && slug.current != $currentProductSlug][0...$limit] {
    _id,
    name,
    price,
    originalPrice,
    stock,
    slug { current },
    image,
    description,
    category
  }`;

  const products = await client.fetch<Product[]>(
    query,
    { category, currentProductSlug, limit },
    { next: { revalidate: 60 } }
  );

  return products;
}