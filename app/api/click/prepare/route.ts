// app/api/click/prepare/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      click_trans_id,
      service_id,
      merchant_trans_id,
      amount,
      action,
      sign_time,
      sign_string,
    } = body;

    // Must be prepare action
    if (action !== "0") {
      return NextResponse.json({ error: -8, error_note: "Invalid action" });
    }

    // Validate signature
    const secret = process.env.CLICK_SECRET_KEY!;
    const hash = crypto
      .createHash("md5")
      .update(click_trans_id + service_id + secret + merchant_trans_id + amount + action + sign_time)
      .digest("hex");

    if (hash !== sign_string) {
      return NextResponse.json({ error: -1, error_note: "Invalid signature" });
    }

    // Find pending order
    const orderQuery = `*[_type == "order" && orderNumber == $orderNumber && payment.method == "click" && payment.status == "pending"][0]`;
    const order = await writeClient.fetch(orderQuery, { orderNumber: merchant_trans_id });

    if (!order) {
      return NextResponse.json({ error: -5, error_note: "Order not found" });
    }

    // Check amount
    if (Number(order.total).toFixed(2) !== Number(amount).toFixed(2)) {
      return NextResponse.json({ error: -2, error_note: "Incorrect amount" });
    }

    // Generate prepare ID
    const merchant_prepare_id = Date.now();

    // Update order
    await writeClient.patch(order._id).set({
      "payment.clickTransId": click_trans_id.toString(),
      "payment.clickPrepareId": merchant_prepare_id,
      "payment.status": "pending",
    }).commit();

    return NextResponse.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id,
      error: 0,
      error_note: "Success",
    });

  } catch (err) {
    console.error("CLICK Prepare error:", err);
    return NextResponse.json({ error: -9, error_note: "Server error" });
  }
}
