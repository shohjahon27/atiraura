'use client';

import { createOrder } from './actions';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export async function handleCheckout(
  cartItems: CartItem[],
  calculatedTotal: number
) {
  try {
    const result = await createOrder({
      customer: {
        name: 'John Doe',
        phone: '+998901234567',
      },
      items: cartItems.map((item) => ({
        product: { _id: item.id },
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
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
        'https://your-site.com/checkout/success?order=' + result.orderNumber
      )}`;

    window.location.href = paymentUrl;
  } catch (err) {
    console.error('Order creation failed:', err);
  }
}
