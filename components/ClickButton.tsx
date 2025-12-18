'use client';

import { Button } from '@/components/ui/button'; // or your button

interface ClickButtonProps {
  orderNumber: string;
  amount: number;
}

export default function ClickButton({ orderNumber, amount }: ClickButtonProps) {
  const handlePay = () => {
    const params = new URLSearchParams({
      service_id: process.env.NEXT_PUBLIC_CLICK_SERVICE_ID!,
      merchant_id: process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID!,
      merchant_user_id: process.env.NEXT_PUBLIC_CLICK_MERCHANT_USER_ID!,
      amount: amount.toFixed(2), // CLICK expects string with 2 decimals
      transaction_param: orderNumber, // This will come back as merchant_trans_id
      return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
      // callback_url not needed — we use prepare/complete
    });

    const paymentUrl = `https://my.click.uz/services/pay?${params.toString()}`;
    window.location.href = paymentUrl;
  };

  return (
    <Button onClick={handlePay} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
      Pay with CLICK ({amount.toLocaleString()} UZS)
    </Button>
  );
}