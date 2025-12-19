'use client';

import { handleCheckout } from './actions';

export default function CheckoutPage() {
  const cartItems = []; // your real cart
  const total = 100;

  return (
    <button onClick={() => handleCheckout(cartItems, total)}>
      Pay with CLICK
    </button>
  );
}
