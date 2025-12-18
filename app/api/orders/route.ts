// app/api/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { client } from "@/sanity/lib/client";
// import { v4 as uuidv4 } from 'uuid';

// Define proper types
interface CartItem {
  product: {
    _id: string;
  };
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface OrderRequestBody {
  customer: Customer;
  items: CartItem[];
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequestBody = await request.json();

    const { customer, items, total } = body;

    // Validate required fields
    if (!customer.name || !customer.phone || !items.length || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await client.create({
      _type: 'order',
      orderNumber,
      customer,
      items: items.map((item) => ({
        product: { _ref: item.product._id, _type: 'reference' },
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      currency: 'UZS',
      payment: {
        method: 'click',
        status: 'pending',
      },
      status: 'processing',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}