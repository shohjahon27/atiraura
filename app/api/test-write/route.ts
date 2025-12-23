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
    console.log('=== TEST WRITE API ===');
    console.log('Token preview:', process.env.SANITY_API_TOKEN?.substring(0, 15) + '...');
    
    // Try to create a SIMPLE document (not 'order' type)
    const testDoc = await sanityClient.create({
      _type: 'testDocument', // Different type name
      message: 'Test write at ' + new Date().toISOString(),
      test: true,
      createdAt: new Date().toISOString(),
    });
    
    console.log('✅ Test document created:', testDoc._id);
    
    // Clean up
    await sanityClient.delete(testDoc._id);
    console.log('✅ Test document deleted');
    
    return NextResponse.json({
      success: true,
      message: 'Write permissions confirmed',
      testId: testDoc._id,
    });
    
  } catch (error: any) {
    console.error('❌ Test write failed:', error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        response: error.responseBody,
      },
      { status: 500 }
    );
  }
}