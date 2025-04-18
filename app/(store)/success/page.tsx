"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useBasketStore from "@/sanity/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const session = await res.json();

        if (session?.metadata?.orderNumber) {
          setOrderNumber(session.metadata.orderNumber);
        }

        clearBasket(); // ✅ Clear basket once session is confirmed
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, clearBasket]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your order...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center">
          Thank You For Your Order!
        </h1>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Your order has been confirmed and will be shipped shortly.
          </p>
          {orderNumber && (
            <p className="text-gray-600">
              <span className="font-semibold">Order Number:</span>{" "}
              <span className="font-mono text-green-600">{orderNumber}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to your email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
