// import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'
import { createClient } from '@sanity/client';



export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
  stega: {
    studioUrl: process.env.VERCEL_URL ?
    `https://${process.env.VERCEL_URL}/studio`
     :`${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  }
})

export const getProducts = async () => {
  const query = `*[_type == "product"]`;
  const products = await client.fetch(query);
  return products;
};

export default createClient;