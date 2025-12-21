// app/(store)/checkout/server-actions.ts
'use server';

import { client } from '@/sanity/lib/client'; // ← adjust if your path is different
import type { CartItem } from './types';

interface CheckoutData {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: CartItem[];
  total: number;
}

export async function createOrder(data: CheckoutData) {
  const { customer, items, total } = data;

  if (!customer.name || !customer.phone || items.length === 0 || total <= 0) {
    throw new Error('Invalid order data');
  }

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const order = await client.create({
    _type: 'order',
    orderNumber,
    customer,
    items: items.map((item) => ({
      product: { _ref: item.id, _type: 'reference' },
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

  return {
    orderNumber: order.orderNumber,
    total: order.total,
  };
}