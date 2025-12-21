'use server';

import { client } from '@/sanity/lib/client';
import type { CartItem } from './types';

type Customer = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

export async function createOrder(
  cartItems: CartItem[],
  total: number,
  customer: Customer
) {
  const orderNumber = `ORD-${Date.now()}`;

  const order = await client.create({
    _type: 'order',
    orderNumber,
    customer,
    items: cartItems.map((item) => ({
      product: {
        _type: 'reference',
        _ref: item.product._id,
      },
      quantity: item.quantity,
      price: item.product.price,
    })),
    total,
    payment: {
      method: 'click',
      status: 'pending',
    },
    createdAt: new Date().toISOString(),
  });

  return {
    orderId: order._id,
    orderNumber,
    total,
  };
}
