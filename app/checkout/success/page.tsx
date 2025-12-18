'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [status, setStatus] = useState<'checking' | 'paid' | 'failed'>('checking');

  useEffect(() => {
    if (!orderNumber) return;

    const checkStatus = async () => {
      const res = await fetch(`/api/orders/status?order=${orderNumber}`);
      const data = await res.json();
      setStatus(data.paymentStatus);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // poll every 5s

    return () => clearInterval(interval);
  }, [orderNumber]);

  if (status === 'paid') return <div>✅ Payment successful! Order #{orderNumber}</div>;
  if (status === 'failed') return <div>❌ Payment failed.</div>;
  return <div>⏳ Checking payment status...</div>;
}