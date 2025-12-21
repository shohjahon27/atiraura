'use client';

import { handleCheckout } from './actions';
import type { CartItem } from './types';

export default function CheckoutPage() {
  const cartItems: CartItem[] = [];
  const total = 100;

  return (
    <button onClick={() => handleCheckout(cartItems, total)}>
      Pay with CLICK
    </button>
  );
}
