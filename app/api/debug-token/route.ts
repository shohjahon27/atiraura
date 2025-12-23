import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = process.env.SANITY_API_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  
  console.log('=== DEBUG TOKEN INFO ===');
  console.log('Token exists:', !!token);
  console.log('Token first 10 chars:', token?.substring(0, 10));
  console.log('Project ID:', projectId);
  console.log('Dataset:', dataset);
  
  return NextResponse.json({
    tokenExists: !!token,
    tokenPreview: token?.substring(0, 10) + '...',
    projectId,
    dataset,
    environment: process.env.NODE_ENV,
  });
}