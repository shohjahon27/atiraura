// lib/sanity/writeClient.ts
import { createClient } from 'next-sanity'

export const writeClient = createClient({
  projectId: '5j047vwu',
  dataset: 'production',
  apiVersion: '2025-03-31',
  useCdn: true, // must be false for write
  token: process.env.SANITY_WRITE_TOKEN, // set this in .env.local
})
