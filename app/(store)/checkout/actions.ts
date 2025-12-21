'use client';

import { createOrder } from './server-actions';
import type { CartItem } from './types';

export async function handleCheckout(
  cartItems: CartItem[],
  calculatedTotal: number
) {
  const result = await createOrder({
    customer: {
      name: 'John Doe',
      phone: '+998901234567',
    },
    items: cartItems,
    total: calculatedTotal,
  });

  const paymentUrl =
    `https://my.click.uz/services/pay` +
    `?service_id=${process.env.NEXT_PUBLIC_CLICK_SERVICE_ID}` +
    `&merchant_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID}` +
    `&merchant_user_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_USER_ID}` +
    `&amount=${result.total.toFixed(2)}` +
    `&transaction_param=${result.orderNumber}` +
    `&return_url=${encodeURIComponent(
      'https://atiraura-two.vercel.app/checkout/success?order=' + result.orderNumber
    )}`;

  window.location.href = paymentUrl;
}