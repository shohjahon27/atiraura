import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-31',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params = Object.fromEntries(formData.entries());
    
    console.log('🔄 Click.uz Callback Received:', params);
    
    // Extract parameters from Click.uz
    const clickTransId = params.click_trans_id?.toString();
    const merchantTransId = params.merchant_trans_id?.toString();
    const merchantPrepareId = params.merchant_prepare_id?.toString();
    const merchantConfirmId = params.merchant_confirm_id?.toString();
    const amount = params.amount?.toString();
    const action = params.action?.toString(); // 0=prepare, 1=complete
    const error = params.error?.toString();
    const errorNote = params.error_note?.toString();
    
    // Find order by orderNumber (merchant_trans_id)
    const orderNumber = merchantTransId;
    if (!orderNumber) {
      console.error('No order number in callback');
      return NextResponse.json({ error: 'No order number' }, { status: 400 });
    }
    
    // Find the order in Sanity
    const query = `*[_type == "order" && orderNumber == $orderNumber][0]`;
    const order = await sanityClient.fetch(query, { orderNumber });
    
    if (!order) {
      console.error('Order not found:', orderNumber);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    console.log('Found order:', order._id);
    
    // Update order based on action
    const updateData: any = {
      clickTransId: clickTransId || '',
      clickPrepareId: merchantPrepareId || '',
      clickConfirmId: merchantConfirmId || '',
      updatedAt: new Date().toISOString(),
    };
    
    if (action === '0') {
      // Prepare action
      updateData.paymentStatus = 'prepared';
      updateData.status = 'processing';
      console.log('Order prepared:', orderNumber);
    } 
    else if (action === '1') {
      // Complete action
      if (error === '0') {
        // Success
        updateData.paymentStatus = 'completed';
        updateData.status = 'paid';
        updateData.paidAt = new Date().toISOString();
        console.log('Payment completed:', orderNumber);
      } else {
        // Failed
        updateData.paymentStatus = 'failed';
        updateData.status = 'payment_failed';
        updateData.paymentError = errorNote;
        console.log('Payment failed:', orderNumber, errorNote);
      }
    }
    
    // Update the order in Sanity
    await sanityClient.patch(order._id).set(updateData).commit();
    
    console.log('✅ Order updated successfully');
    
    // Return success to Click.uz (they expect specific format)
    return NextResponse.json({
      click_trans_id: clickTransId,
      merchant_trans_id: merchantTransId,
      merchant_prepare_id: merchantPrepareId,
      merchant_confirm_id: merchantConfirmId,
      error: error || '0',
      error_note: errorNote || 'Success',
    });
    
  } catch (error: any) {
    console.error('❌ Click.uz callback error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}