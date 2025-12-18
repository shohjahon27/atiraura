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

    // Calculate total amount in UZS (tiyn = smallest currency unit)
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product.price! * item.quantity * 100); // Convert to tiyn
    }, 0);

    // Get Click.uz credentials
    const merchantId = process.env.CLICK_MERCHANT_ID;
    const serviceId = process.env.CLICK_SERVICE_ID;
    const secretKey = process.env.CLICK_SECRET_KEY;

    if (!merchantId || !serviceId || !secretKey) {
      throw new Error("Click.uz configuration is missing");
    }

    // Prepare Click.uz parameters
    const clickParams = {
      merchant_id: merchantId,
      service_id: serviceId,
      amount: totalAmount.toString(), // Amount in tiyn
      transaction_param: metadata.orderNumber,
      merchant_user_id: metadata.clerkUserId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/cancel`,
    };

    // Generate Click.uz signature (MD5 hash)
    const signature = generateClickSignature(clickParams, secretKey);

    // Construct Click.uz payment URL
    const clickUrl = new URL("https://my.click.uz/services/pay");
    
    // Add all parameters to URL
    Object.entries(clickParams).forEach(([key, value]) => {
      clickUrl.searchParams.append(key, value.toString());
    });
    clickUrl.searchParams.append("signature", signature);
    clickUrl.searchParams.append("sign_time", Date.now().toString());

    return clickUrl.toString();
  } catch (error) {
    console.error("Error creating Click checkout session:", error);
    throw new Error("Failed to create Click.uz checkout session");
  }
}

// Helper function to generate Click.uz signature
function generateClickSignature(params: Record<string, string | number>, secretKey: string): string {
  // Click.uz signature format (MD5):
  // MD5(merchant_id + service_id + amount + transaction_param + merchant_user_id + secret_key)
  
  const signString = 
    params.merchant_id.toString() + 
    params.service_id.toString() + 
    params.amount.toString() + 
    params.transaction_param.toString() + 
    params.merchant_user_id.toString() + 
    secretKey;

  // Create MD5 hash
  const crypto = require('crypto');
  return crypto.createHash('md5').update(signString, 'utf-8').digest('hex');
}