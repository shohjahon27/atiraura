'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order');

  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">To'lov muvaffaqiyatli!</h1>
      <p className="text-xl mb-8">Buyurtma raqami: {order || 'Noma\'lum'}</p>
      <p>Rahmat! Tez orada siz bilan bog'lanamiz.</p>
    </div>
  );
}