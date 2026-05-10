import { NextResponse } from "next/server";
import { devErrorFields, ensureSchema, getSql } from "@/lib/db";
import { messageFromRow } from "@/lib/messageJson";

export const runtime = "nodejs";

function dbErrorResponse(err) {
  if (err.code === "NO_DATABASE") {
    return NextResponse.json(
      { error: "Database not configured (set POSTGRES_URL or DATABASE_URL)." },
      { status: 503 }
    );
  }
  return null;
}

export async function GET() {
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      SELECT id, name, message, created_at FROM messages ORDER BY id DESC
    `;
    const serialized = rows.map((row) => messageFromRow(row));
    return NextResponse.json(serialized);
  } catch (err) {
    const early = dbErrorResponse(err);
    if (early) return early;
    return NextResponse.json(
      { error: "Failed to load messages", ...devErrorFields(err) },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await ensureSchema();
    const sql = getSql();
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!name || !message) {
      return NextResponse.json({ error: "name and message are required" }, { status: 400 });
    }
    const inserted = await sql`
      INSERT INTO messages (name, message)
      VALUES (${name}, ${message})
      RETURNING id, name, message, created_at
    `;
    const row = inserted[0];
    return NextResponse.json(messageFromRow(row), { status: 201 });
  } catch (err) {
    const early = dbErrorResponse(err);
    if (early) return early;
    return NextResponse.json(
      { error: "Failed to save message", ...devErrorFields(err) },
      { status: 500 }
    );
  }
}
