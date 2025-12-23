import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/writeClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('CLICK COMPLETE HIT:', new Date().toISOString(), body); // ← LOG

  try {
    const body = await req.json();

    const {
      click_trans_id,
      service_id,
      merchant_trans_id,
      merchant_prepare_id,
      amount,
      action,
      error,
      sign_time,
      sign_string,
    } = body;

    if (action !== "1") {
      return NextResponse.json({ error: -8, error_note: "Invalid action" });
    }

    const secret = process.env.CLICK_SECRET_KEY!;
    const hash = crypto
      .createHash("md5")
      .update(click_trans_id + service_id + secret + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)
      .digest("hex");

    if (hash !== sign_string) {
      return NextResponse.json({ error: -1, error_note: "Invalid signature" });
    }

    // Find order
    const orderQuery = `*[_type == "order" && orderNumber == $orderNumber && payment.method == "click"][0]`;
    const order = await writeClient.fetch(orderQuery, { orderNumber: merchant_trans_id });

    if (!order) {
      return NextResponse.json({ error: -5, error_note: "Order not found" });
    }

    if (order.payment.status === "paid") {
      return NextResponse.json({ error: -4, error_note: "Already paid" });
    }

    if (Number(order.payment.clickPrepareId) !== Number(merchant_prepare_id)) {
      return NextResponse.json({ error: -6, error_note: "Invalid prepare id" });
    }

    if (Number(error) < 0) {
      // Payment cancelled
      await writeClient.patch(order._id).set({ "payment.status": "failed" }).commit();
      return NextResponse.json({ error: -9, error_note: "Payment cancelled" });
    }

    // SUCCESS — mark as paid
    const merchant_confirm_id = Date.now();

    await writeClient.patch(order._id).set({
      "payment.status": "paid",
      "payment.clickConfirmId": merchant_confirm_id,
    }).commit();

    // Optional: fulfill order (email, stock, etc.)

return NextResponse.json({
      click_trans_id: body.click_trans_id,
      merchant_trans_id: body.merchant_trans_id,
      merchant_confirm_id,
      error: 0,
      error_note: 'Success',
    });
  } catch (err) {
    console.error('COMPLETE ERROR:', err);
    return NextResponse.json({ error: -9, error_note: 'Server error' });
  }
}
