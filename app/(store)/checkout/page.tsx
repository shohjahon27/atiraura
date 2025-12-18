// import { client } from "@/sanity/lib/client";

// Example using a server action or fetch
const createOrder = async (formData: {
  customer: { name: string; phone: string; email?: string; address?: string };
  items: Array<{ product: data: { items: CartItem[]; total: number; customer: Customer }; name: string; price: number; quantity: number }>;
  total: number;
}) => {
  'use server';

  const { customer, items, total } = formData;

  // Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = await client.create({
    _type: 'order',
    orderNumber,
    customer,
    items: items.map(item => ({
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

  return { orderNumber, total: order.total };
};