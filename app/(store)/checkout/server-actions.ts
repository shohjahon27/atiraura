'use server';

import type { CartItem } from './types';

export async function createOrder(data: {
  customer: { name: string; phone: string };
  items: CartItem[];
  total: number;
}) {
  // Implement the order creation logic here (e.g., database insertion, validation).
  // For now, return a mock result.
  return {
    orderNumber: 'ORDER123',
    total: data.total,
  };
}