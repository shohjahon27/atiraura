'use server';

import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-12-31',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// More flexible type definition
export type OrderItem = {
  product: { 
    _id: string; 
    name?: string; 
    price?: number;  // Changed from `price: number` to `price?: number`
  }; 
  quantity: number;
};

export async function createOrder(orderData: {
  customer: { name: string; phone: string; email?: string; address: string };
  items: OrderItem[];
  total: number;
  orderNumber: string;
}) {
  try {
    console.log('🔧 Creating order in Sanity...');
    
    // First, let's test if the token works
    console.log('Testing Sanity connection...');
    
    // Test with a simple document first
    try {
      const testDoc = await sanityClient.create({
        _type: 'testConnection',
        message: 'Testing write permissions',
        timestamp: new Date().toISOString(),
      });
      console.log('✅ Test document created:', testDoc._id);
      
      // Clean up
      await sanityClient.delete(testDoc._id);
      console.log('✅ Test document cleaned up');
    } catch (testError: any) {
      console.error('❌ SANITY TOKEN TEST FAILED:', testError.message);
      console.error('Token issue detected!');
      return {
        success: false,
        error: `Sanity token error: ${testError.message}`,
      };
    }

    // Now create the actual order
    const order = await sanityClient.create({
      _type: 'order',
      customer: {
        _type: 'customer',
        name: orderData.customer.name,
        phone: orderData.customer.phone,
        email: orderData.customer.email || '',
        address: orderData.customer.address,
      },
      items: orderData.items.map(item => ({
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product._id,
        },
        productName: item.product.name || 'Unknown Product',
        quantity: item.quantity,
        price: item.product.price || 0, // Handle undefined price
      })),
      total: orderData.total,
      status: 'pending',
      paymentMethod: 'click',
      orderNumber: orderData.orderNumber,
      createdAt: new Date().toISOString(),
    });

    console.log('🎉 Order created successfully:', order._id);

    return {
      success: true,
      orderId: order._id,
    };

  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.responseBody,
    });
    
    return {
      success: false,
      error: error.message || 'Unknown error creating order',
    };
  }
}