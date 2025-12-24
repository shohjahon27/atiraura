// lib/orders/getMyOrders.tsx
import { client } from '@/sanity/lib/client'; // or writeClient if needed

export async function getMyOrders(clerkUserId: string) {
  const orders = await client.fetch(
    `*[_type == "order" && clerkUserId == $clerkUserId] | order(createdAt desc) {
      orderNumber,
      createdAt,
      total,
      currency,
      status,
      "paymentStatus": payment.status,
      customer,
      items[] {
        quantity,
        "product": product-> {
          _id,
          name,
          price,
          "image": image.asset->url
        }
      }
    }`,
    { clerkUserId }
  );

  return orders;
}