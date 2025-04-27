// sanity/lib/products/getProductByIds.ts

import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";

export const getProductByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids.length) return [];

  const query = `*[_type == "product" && _id in $ids]`;
  const products = await client.fetch(query, { ids });
  
  return products;
};
