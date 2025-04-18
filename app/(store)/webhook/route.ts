import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { Metadata } from "@/actions/createCheckoutSession";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      console.log("✅ Order created:", order);
    } catch (err) {
      console.error("❌ Failed to save order to Sanity:", err);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });
      const products = lineItems.data.map((item) => {
        const stripeProduct = item.price?.product as Stripe.Product;
        const sanityProductId = stripeProduct?.metadata?.id;
        return {
          _key: crypto.randomUUID(),
          product: {
            _type: 'reference',
            _ref: sanityProductId, // 👈 this is the Sanity product ID
          },
          quantity: item.quantity || 1,
        };
      });
  
      const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        stripeCustomerId: customer,
        customerName,
        email: customerEmail,
        clerkUserId,
        currency,
        sanityProducts: products,
        amountDiscount: total_details?.amount_discount
          ? total_details.amount_discount / 100
          : 0,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
      });
  
      return order;
  }
