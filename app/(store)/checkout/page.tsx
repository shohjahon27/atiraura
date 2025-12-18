// app/(store)/checkout/page.tsx  (or wherever you define this server action)

'use server';

import { client } from '@/sanity/lib/client';

// Define proper types (adjust according to your actual cart/item structure)
interface CartItem {
  product: {
    _id: string;
    // add other product fields if needed
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

interface CreateOrderFormData {
  customer: Customer;
  items: CartItem[];
  total: number;
}

// Server Action
export const createOrder = async (formData: CreateOrderFormData) => {
  'use server';

  const { customer, items, total } = formData;

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

  return {
    orderNumber: order.orderNumber,
    total: order.total,
  };
};