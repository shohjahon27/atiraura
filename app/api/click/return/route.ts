import { NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const orderId = searchParams.get('merchant_trans_id');
  const amount = searchParams.get('amount');
  const error = searchParams.get('error');

  if (!orderId) {
    return NextResponse.redirect('/checkout/error?message=No order ID');
  }

  if (error && parseInt(error) < 0) {
    // Payment failed
    await sanityClient
      .patch({ query: `*[_type == "order" && orderNumber == "${orderId}"]` })
      .set({ 'payment.status': 'failed' })
      .commit();

    const errorNote = searchParams.get('error_note') || 'To\'lov amalga oshmadi';
    return NextResponse.redirect(
      `/checkout/failed?order=${orderId}&error=${encodeURIComponent(errorNote)}`
    );
  }

  // Payment successful
  return NextResponse.redirect(
    `/checkout/success?order=${orderId}&amount=${amount}`
  );
}