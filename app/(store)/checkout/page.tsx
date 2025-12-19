// app/(store)/checkout/page.tsx

'use client';

import { createOrder } from './actions'; // ← adjust path if you put it elsewhere
// e.g., import { createOrder } from '@/lib/actions/createOrder';

// ... your other imports and code

// Example usage in your form handler
const handleCheckout = async (cartItems: any[], calculatedTotal: number) => {
  try {
    const result = await createOrder({
      customer: {
        name: 'John Doe',
        phone: '+998901234567',
        // email, address optional
      },
      items: cartItems, // your cart array
      total: calculatedTotal,
    });

    console.log('Order created:', result.orderNumber);

    // Now redirect to CLICK payment
    const paymentUrl = `https://my.click.uz/services/pay?service_id=${process.env.NEXT_PUBLIC_CLICK_SERVICE_ID}&merchant_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID}&merchant_user_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_USER_ID}&amount=${result.total.toFixed(2)}&transaction_param=${result.orderNumber}&return_url=${encodeURIComponent('https://your-site.com/checkout/success?order=' + result.orderNumber)}`;

    window.location.href = paymentUrl;

  } catch (error) {
    console.error('Order creation failed:', error);
    // Show error to user
  }
};