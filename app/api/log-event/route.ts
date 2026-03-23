import { NextResponse } from "next/server";
import { supabase } from "../../../src/lib/supabase";
import { ACTIVE_CLIENT } from "../../../src/lib/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { sessionId, type, metadata, pageUrl } = body;

    if (!sessionId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await supabase.from("events").insert({
      session_id: sessionId,
      type,
      metadata: metadata ?? null,
      client_id: ACTIVE_CLIENT,
      page_url: pageUrl ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[log-event] Failed:", err);
    return NextResponse.json(
      { error: "Failed to log event" },
      { status: 500 },
    );
  }
}
