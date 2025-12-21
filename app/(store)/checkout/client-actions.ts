// app/(store)/checkout/client-actions.ts  (or actions.ts)

'use client';

import { createOrder } from './server-actions';
import type { CartItem } from './types';

type Customer = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

export async function handleCheckout(
  cartItems: CartItem[],
  total: number,
  customer: Customer
) {
  const result = await createOrder(cartItems, total, customer);

  const paymentUrl =
    `https://my.click.uz/services/pay?` +
    `service_id=${process.env.NEXT_PUBLIC_CLICK_SERVICE_ID}` +
    `&merchant_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID}` +
    `&merchant_user_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_USER_ID}` +  // ← This is correct (71722)
    `&amount=${result.total.toFixed(2)}` +
    `&transaction_param=${result.orderNumber}` +
    `&return_url=${encodeURIComponent(
      `${window.location.origin}/checkout/success?order=${result.orderNumber}`
    )}`;

  window.location.href = paymentUrl;
}