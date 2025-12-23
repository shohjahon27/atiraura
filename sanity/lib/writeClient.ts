// sanity/lib/writeClient.ts
import { createClient } from "next-sanity";

export const writeClient = createClient({
  projectId: "5j047vwu",
  dataset: "production",
  apiVersion: "2025-03-31",
  useCdn: false, // ✅ MUST BE FALSE FOR WRITES
  token: process.env.SANITY_WRITE_TOKEN,
});
