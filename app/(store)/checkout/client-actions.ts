// app/(store)/checkout/client-actions.ts   ← rename the file!
'use client';

import { createOrder } from './server-actions';

export async function handleCheckout(
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  total: number,
  customer: { name: string; phone: string; email?: string; address?: string }
) {
  try {
    const result = await createOrder({
      customer,
      items: cartItems,
      total,
    });

    const params = new URLSearchParams({
      service_id: process.env.NEXT_PUBLIC_CLICK_SERVICE_ID || '',
      merchant_id: process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID || '',
      merchant_user_id: process.env.NEXT_PUBLIC_CLICK_MERCHANT_USER_ID || '',
      amount: result.total.toFixed(2),
      transaction_param: result.orderNumber,
      return_url: `${window.location.origin}/checkout/success?order=${result.orderNumber}`,
    });

    window.location.href = `https://my.click.uz/services/pay?${params.toString()}`;
  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Buyurtma yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
  }
}