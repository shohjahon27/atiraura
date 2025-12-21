// app/(store)/actions/createClickCheckout.ts
"use server";

import { BasketItem } from "@/sanity/lib/store";

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createClickCheckout(
  items: GroupedBasketItem[],
  metadata: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
  }
) {
  try {
    // Check if any items are missing a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    // Calculate total amount in UZS (soums, NOT tiyn)
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product.price! * item.quantity);
    }, 0);

    // Get Click.uz credentials from environment
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID; // ← correct merchant ID from env (71722)

    if (!merchantId || !serviceId || !merchantUserId) {
      throw new Error("Click.uz configuration is missing");
    }

    // Prepare Click.uz parameters (no signature/sign_time needed here)
    const clickParams = {
      merchant_id: merchantId,
      service_id: serviceId,
      merchant_user_id: merchantUserId, // ← fixed: now uses env value, not clerkUserId
      amount: totalAmount.toFixed(2), // amount in soums with 2 decimals
      transaction_param: metadata.orderNumber,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://atiraura-two.vercel.app'}/payment/success?order=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://atiraura-two.vercel.app'}/payment/cancel`,
    };

    // Build clean URL using URLSearchParams
    const clickUrl = new URL("https://my.click.uz/services/pay");
    Object.entries(clickParams).forEach(([key, value]) => {
      clickUrl.searchParams.append(key, value);
    });

    return clickUrl.toString();

  } catch (error) {
    console.error("Error creating Click checkout session:", error);
    throw new Error("Failed to create Click.uz checkout session");
  }
}