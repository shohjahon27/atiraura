import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-31',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

interface OrderItemRequest {
  product?: { 
    _id?: string 
  };
  name?: string;
  price?: number;
  quantity?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📦 Creating order from API route:', body);
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create order in Sanity
    const order = await sanityClient.create({
      _type: 'order',
      customer: {
        _type: 'customer',
        name: body.customer?.name || 'No name',
        phone: body.customer?.phone || 'No phone',
        email: body.customer?.email || 'No email',
        address: body.customer?.address || 'No address',
      },
      items: (body.items || []).map((item: OrderItemRequest) => ({
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product?._id || '',
        },
        productName: item.name || 'Unknown',
        quantity: item.quantity || 1,
        price: item.price || 0,
      })),
      total: body.total || 0,
      status: 'pending',
      paymentMethod: 'click',
      orderNumber,
      createdAt: new Date().toISOString(),
    });
    
    console.log('✅ Order created:', order._id);
    
    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber,
    });
    
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ API route error:', err);
    
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}