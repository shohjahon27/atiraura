import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { client } from "@/sanity/lib/client";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      click_trans_id,
      service_id,
      merchant_trans_id, // ← this is your orderNumber
      amount,
      action,
      sign_time,
      sign_string,
    } = body;

    // Validate action
    if (action !== '0') {
      return Response.json({ error: -8, error_note: 'Invalid action' });
    }

    // Validate signature
    const secret = process.env.CLICK_SECRET_KEY!;
    const hash = crypto
      .createHash('md5')
      .update(`${click_trans_id}${service_id}${secret}${merchant_trans_id}${amount}${action}${sign_time}`)
      .digest('hex');

    if (hash !== sign_string) {
      return Response.json({ error: -1, error_note: 'Invalid signature' });
    }

    // Find order
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber && payment.method == "click" && payment.status == "pending"][0]`,
      { orderNumber: merchant_trans_id }
    );

    if (!order) {
      return Response.json({ error: -5, error_note: 'Order not found' });
    }

    if (Number(order.total).toFixed(2) !== Number(amount).toFixed(2)) {
      return Response.json({ error: -2, error_note: 'Incorrect amount' });
    }

    // Generate prepare ID (can be number or string, CLICK accepts both)
    const clickPrepareId = Date.now();

    // Update order
    await client
      .patch(order._id)
      .set({
        'payment.status': 'pending', // still pending until complete
        'payment.clickTransId': click_trans_id.toString(),
        'payment.clickPrepareId': clickPrepareId,
      })
      .commit();

    return Response.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: clickPrepareId,
      error: 0,
      error_note: 'Success',
    });
  } catch (error) {
    console.error('CLICK Prepare Error:', error);
    return Response.json({ error: -9, error_note: 'Server error' });
  }
}