// app/api/contact/route.ts
import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: "5j047vwu",
  dataset: "production",
  useCdn: false,
  apiVersion: "2025-03-31", // <-- must be in this format!
  token: process.env.SANITY_API_WRITE_TOKEN, // must be defined in your .env
});

export async function POST(request: Request) {
  try {
    const { name, phone, message, userId } = await request.json();

    // Validate the incoming data (only check for required fields)
    if (!name || !phone || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Save the message to Sanity
    const newMessage = {
      _type: "message",
      name,
      phone, // Store the phone number as-is (with spaces if present)
      message: message || "",
      userId,
      createdAt: new Date().toISOString(),
    };

    await client.create(newMessage);

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}