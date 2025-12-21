// app/(store)/checkout/page.tsx
'use client';

import { useState } from 'react';
import { handleCheckout } from './client-actions';
// Assume you have cart context or props — here using mock for simplicity
// In real app: use your cart store (e.g., Zustand, Context, Clerk, etc.)

const mockCart = [
  {
    id: '44813e20-f1fd-47d4-9af5-c89c19474a68',
    name: 'Parfum Atir MEN No.2',
    price: 1000,
    quantity: 2,
  },
];

const mockTotal = 2000;

export default function CheckoutPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !phone) {
      alert('Ism va telefon raqamni kiriting!');
      return;
    }

    setLoading(true);
    await handleCheckout(
      mockCart,
      mockTotal,
      { name, phone, email: email || undefined, address: address || undefined }
    );
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="space-y-4">
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
          className="w-full p-3 border rounded"
        />

        <div className="text-xl font-bold my-6">
          Jami: {mockTotal.toLocaleString()} UZS
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Yuklanmoqda...' : 'CLICK bilan to\'lash'}
        </button>
      </div>
    </div>
  );
}