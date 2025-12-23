'use server';

import { createClient } from '@sanity/client';

// Debug: Log environment variables AT THE TOP LEVEL
console.log('=== SERVER ACTION ENV CHECK ===');
console.log('Project ID exists:', !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset exists:', !!process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('Token exists:', !!process.env.SANITY_API_TOKEN);
console.log('Token preview:', process.env.SANITY_API_TOKEN?.substring(0, 10) + '...');
console.log('================================');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-31',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

export async function createOrder(orderData: any) {
  try {
    console.log('🚀 Server action called with:', orderData);
    
    // TEST 1: Can we query? (Read permission test)
    console.log('Testing read permissions...');
    const count = await sanityClient.fetch('count(*)');
    console.log('✅ Can read from Sanity. Document count:', count);
    
    // TEST 2: Create a simple test document
    console.log('Testing write permissions...');
    const testDoc = await sanityClient.create({
      _type: 'testOrder',
      message: 'Test write at ' + new Date().toISOString(),
      test: true,
    });
    console.log('✅ Test document created:', testDoc._id);
    
    // Clean up test document
    await sanityClient.delete(testDoc._id);
    console.log('✅ Test document deleted');
    
    // TEST 3: Now create the actual order
    console.log('Creating real order...');
    const order = await sanityClient.create({
      _type: 'order',
      customer: {
        _type: 'customer',
        name: orderData.customer?.name || 'No name',
        phone: orderData.customer?.phone || 'No phone',
        email: orderData.customer?.email || 'No email',
        address: orderData.customer?.address || 'No address',
      },
      items: (orderData.items || []).map((item: any) => ({
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product?._id,
        },
        productName: item.product?.name || 'Unknown',
        quantity: item.quantity || 1,
        price: item.product?.price || 0,
      })),
      total: orderData.total || 0,
      status: 'pending',
      paymentMethod: 'click',
      orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    
    console.log('🎉 ORDER CREATED SUCCESSFULLY! ID:', order._id);
    
    return {
      success: true,
      orderId: order._id,
    };
    
  } catch (error: any) {
    console.error('❌ SERVER ACTION ERROR:');
    console.error('Message:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Response:', error.responseBody);
    
    // Check specific error types
    if (error.message.includes('Insufficient permissions')) {
      console.error('⚠️ PERMISSION DETAILS:');
      console.error('Token used:', process.env.SANITY_API_TOKEN?.substring(0, 15) + '...');
      console.error('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
      console.error('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    }
    
    return {
      success: false,
      error: `Sanity error: ${error.message}`,
      details: error.responseBody,
    };
  }
}