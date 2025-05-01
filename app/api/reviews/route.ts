// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client"; // uses token from server-side env

export async function POST(req: Request) {
  const { name, comment, rating, productId } = await req.json();

  try {
    const review = await client.create({
      _type: "review",
      name,
      comment,
      rating,
      product: {
        _type: "reference",
        _ref: productId,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
