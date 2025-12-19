// app/(store)/checkout/actions.ts   (or any path you like)

'use server';

import { client } from "@/sanity/lib/client";

interface CartItem {
  product: { _id: string };
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

interface CreateOrderFormData {
  customer: Customer;
  items: CartItem[];
  total: number;
}

export async function createOrder(formData: CreateOrderFormData) {
  'use server';

  const { customer, items, total } = formData;

  if (!customer.name || !customer.phone || items.length === 0 || !total) {
    throw new Error('Missing required fields');
  }

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

  return {
    orderNumber,
    total: order.total,
  };
}