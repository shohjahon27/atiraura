// app/api/orders/create/route.ts
import { client } from "@/sanity/lib/client"; // adjust path
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { cartItems, totalAmount } = await req.json();

  const orderId = uuidv4(); // or any unique string

  const order = await client.create({
    _type: 'order',
    orderId,
    cartItems: cartItems.map((item: any) => ({ _ref: item._id, _type: 'reference' })),
    totalAmount,
    status: 'pending',
  });

  return NextResponse.json({ orderId: order.orderId, totalAmount: order.totalAmount });
}