import { groq } from "next-sanity";
import { client } from "../client";

export async function getReviewsByProduct(productId: string) {
  const query = groq`
    *[_type == "review" && product._ref == $productId] | order(_createdAt desc) {
      _id,
      name,
      rating,
      comment,
      _createdAt
    }
  `;
  return await client.fetch(query, { productId });
}
