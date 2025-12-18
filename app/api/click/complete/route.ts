import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { client } from "@/sanity/lib/client";


export async function POST(req: NextRequest) {
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

    if (action !== '1') {
      return Response.json({ error: -8, error_note: 'Invalid action' });
    }

    // Validate signature
    const secret = process.env.CLICK_SECRET_KEY!;
    const hash = crypto
      .createHash('md5')
      .update(`${click_trans_id}${service_id}${secret}${merchant_trans_id}${merchant_prepare_id}${amount}${action}${sign_time}`)
      .digest('hex');

    if (hash !== sign_string) {
      return Response.json({ error: -1, error_note: 'Invalid signature' });
    }

    // Find order
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber && payment.method == "click"][0]`,
      { orderNumber: merchant_trans_id }
    );

    if (!order) {
      return Response.json({ error: -5, error_note: 'Order not found' });
    }

    // Check if already paid
    if (order.payment.status === 'paid') {
      return Response.json({ error: -4, error_note: 'Already paid' });
    }

    // Check prepare ID
    if (order.payment.clickPrepareId != merchant_prepare_id) {
      return Response.json({ error: -6, error_note: 'Invalid prepare ID' });
    }

    if (Number(error) !== 0) {
      // Payment failed or cancelled
      await client
        .patch(order._id)
        .set({ 'payment.status': 'failed' })
        .commit();

      return Response.json({ error: error, error_note: 'Payment failed' });
    }

    // SUCCESS! Mark as paid
    const clickConfirmId = Date.now();

    await client
      .patch(order._id)
      .set({
        'payment.status': 'paid',
        'payment.clickConfirmId': clickConfirmId,
      })
      .commit();

    // Optional: update order status to shipped later manually

    return Response.json({
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: clickConfirmId,
      error: 0,
      error_note: 'Success',
    });
  } catch (err) {
    console.error('CLICK Complete Error:', err);
    return Response.json({ error: -9, error_note: 'Server error' });
  }
}