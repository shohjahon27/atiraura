"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/app/(store)/loading";

type Order = {
  orderNumber: string;
  total: number;
};

export default function PayPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderNumber) return;

    fetch(`/api/order/${orderNumber}`)
      .then(res => res.json())
      .then(setOrder)
      .catch(() => setError("Buyurtma topilmadi"));
  }, [orderNumber]);

  if (!orderNumber) {
    return <div className="text-center mt-20 text-red-600">Order mavjud emas</div>;
  }

  if (!order) {
    return <Loader />;
  }

  const paymentUrl =
    `https://my.click.uz/services/pay?` +
    `service_id=${process.env.NEXT_PUBLIC_CLICK_SERVICE_ID}` +
    `&merchant_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID}` +
    `&merchant_user_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_USER_ID}` +
    `&amount=${order.total.toFixed(2)}` +
    `&transaction_param=${order.orderNumber}` +
    `&return_url=${encodeURIComponent(
      `${window.location.origin}/checkout/success?order=${order.orderNumber}`
    )}`;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">To‘lov</h1>

      <p><strong>Buyurtma:</strong> {order.orderNumber}</p>
      <p><strong>Summa:</strong> {order.total.toFixed(2)} so‘m</p>

      {error && <p className="text-red-600">{error}</p>}

      <a
        href={paymentUrl}
        className="block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded mt-6"
      >
        Click orqali to‘lash
      </a>
    </div>
  );
}
