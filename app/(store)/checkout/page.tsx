// app/(store)/checkout/page.tsx
'use client';

import { useState } from 'react';
import { handleCheckout } from './client-actions';
import type { CartItem } from './types';

// Correct mock cart matching CartItem type
const mockCart: CartItem[] = [
  {
    product: {
      _id: '44813e20-f1fd-47d4-9af5-c89c19474a68',
      name: 'Parfum Atir MEN No.2',
      price: 1000,
    },
    quantity: 1,
  },
];

export default function CheckoutPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const cartItems = mockCart;
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const onSubmit = async () => {
    if (!name || !phone) {
      alert('Ism va telefon raqamini kiriting!');
      return;
    }

    setLoading(true);
    await handleCheckout(cartItems, total, { name, phone, email: email || undefined, address: address || undefined });
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Buyurtma berish</h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Ismingiz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Telefon: +998901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email (ixtiyoriy)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <textarea
          placeholder="Manzil (ixtiyoriy)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border rounded h-24"
        />

        <div className="text-xl font-bold my-4">
          Jami: {total.toLocaleString()} so'm
        </div>

<button
  type="button"
  onClick={onSubmit}
  disabled={loading}
  className="w-full bg-blue-500 text-white py-3 rounded font-bold hover:bg-blue-600 disabled:opacity-50"
>
  {loading ? 'Yuklanmoqda...' : 'CLICK bilan to&apos;lash'}
</button>
      </form>
    </div>
  );
}