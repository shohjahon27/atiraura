import { client } from "@/sanity/lib/client";

export async function getAllCategories() {
  const query = `*[_type == "category"] {
    _id,
    name,
    slug {
      current
    }
  }`;
  const categories = await client.fetch(query);
  return categories;
}