import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    channel: "whatsapp",
    message: "Webhook reservado para integração futura."
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    received: Boolean(payload),
    queued: false
  });
}
