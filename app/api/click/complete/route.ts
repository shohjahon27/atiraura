import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    console.log('CLICK COMPLETE HIT:', new Date().toISOString(), body);

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

    // Note: You need to implement the actual order update logic here
    // This is a placeholder - you need to import and use your Sanity client

    return NextResponse.json({
      click_trans_id: body.click_trans_id,
      merchant_trans_id: body.merchant_trans_id,
      merchant_confirm_id: Date.now(),
      error: 0,
      error_note: 'Success',
    });
  } catch (err) {
    console.error('COMPLETE ERROR:', err);
    return NextResponse.json({ error: -9, error_note: 'Server error' });
  }
}