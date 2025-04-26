import { client } from "@/sanity/lib/client";

export async function getFeaturedProducts() {
  const query = `*[_type == "product" && featured == true] {
    _id,
    name,
    image,
    description,
    price,
    slug {
      current
    },
    stock,
    featured,
  }`;
  const featuredProducts = await client.fetch(query);
  console.log("Fetched featured products:", featuredProducts);
  return featuredProducts;
}