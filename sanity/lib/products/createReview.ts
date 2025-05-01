import { writeClient } from "@/sanity/lib/writeClient";

export async function createReview({
  name,
  rating,
  comment,
  productId,
}: {
  name: string;
  rating: number;
  comment: string;
    _createdAt: string;
  productId: string;
}) {
  return await writeClient.create({
    _type: "review",
    name,
    rating,
    comment,
    product: {
      _type: "reference",
      _ref: productId,
    },
    _createdAt: new Date().toISOString(),
  });
}
