'use client';

import { useState } from 'react';
import useBasketStore from '@/sanity/lib/store';
import ClickButton from '@/components/ClickButton';

interface OrderItem {
  product: { 
    _id: string;
    name: string | undefined;
    price: number | undefined;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearBasket } = useBasketStore();
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const total = getTotalPrice();

  const handleSubmit = async () => {
    // Validation
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setError('Iltimos, barcha maydonlarni to&apos;ldiring');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate order number
      const generatedOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Prepare items with proper types
      const orderItems: OrderItem[] = items.map(i => {
        const price = i.product.price || 0;
        
        return {
          product: { 
            _id: i.product._id,
            name: i.product.name || 'Unknown Product',
            price: price
          },
          quantity: i.quantity,
        };
      });

      console.log('📤 Sending order data to API:', {
        customer,
        items: orderItems,
        total,
        orderNumber: generatedOrderNumber
      });

      // Use API route instead of server action
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          items: orderItems,
          total,
          orderNumber: generatedOrderNumber,
        }),
      });

      const data = await response.json();

      console.log('API Response:', data);

      if (data.success) {
        console.log('✅ Order created successfully via API');
        setOrderNumber(generatedOrderNumber);
        clearBasket();
      } else {
        console.error('❌ API failed:', data.error);
        setError('Buyurtma yaratishda xatolik: ' + data.error);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('❌ Checkout error:', error);
      setError('Server xatosi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* CUSTOMER FORM */}
      {!orderNumber && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Ismingiz *</label>
            <input
              placeholder="Ism Familiya"
              className="w-full border p-3 rounded"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Telefon raqamingiz *</label>
            <input
              placeholder="+998 XX XXX XX XX"
              className="w-full border p-3 rounded"
              value={customer.phone}
              onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Email (ixtiyoriy)</label>
            <input
              placeholder="email@example.com"
              className="w-full border p-3 rounded"
              value={customer.email}
              onChange={e => setCustomer({ ...customer, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Manzil *</label>
            <textarea
              placeholder="To&apos;liq manzilingiz"
              className="w-full border p-3 rounded"
              rows={3}
              value={customer.address}
              onChange={e => setCustomer({ ...customer, address: e.target.value })}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !customer.name || !customer.phone || !customer.address}
            className={`w-full py-3 rounded font-medium ${
              loading || !customer.name || !customer.phone || !customer.address
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Yuborilmoqda...' : 'Davom etish'}
          </button>
        </div>
      )}

      {/* PAYMENT */}
      {orderNumber && (
        <div className="text-center">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Buyurtma qabul qilindi!</h2>
            <p className="text-gray-600">Buyurtma raqamingiz: <strong>{orderNumber}</strong></p>
            <p className="text-gray-600 mt-2">Endi to&apos;lovni amalga oshiring:</p>
          </div>
          
          <ClickButton
            orderNumber={orderNumber}
            amount={total}
          />
          
          <p className="mt-4 text-sm text-gray-500">
            To&apos;lov tugagach, sizga SMS xabar yuboriladi.
          </p>
        </div>
      )}
    </div>
  );
}