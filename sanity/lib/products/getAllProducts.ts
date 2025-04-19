import { client } from "@/sanity/lib/client";

export async function getAllProducts() {
  const query = `*[_type == "product"] {
    _id,
    name,
    image,
    price,
    slug {
      current
    },
    stock,
    featured
  }`;
  const products = await client.fetch(query);
  console.log("Fetched products:", products);
  return products;
}