'use client';
export const dynamic = 'force-dynamic';
// ... rest of your page component code
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Move the main logic into an inner component
function SuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order');

  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl mb-8">Order Number: {order || 'Unknown'}</p>
      <p>Thank you! We will contact you shortly.</p>
    </div>
  );
}

// The exported default component wraps the inner one with Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}