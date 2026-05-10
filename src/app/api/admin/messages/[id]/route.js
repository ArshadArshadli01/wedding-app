import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { devErrorFields, ensureSchema, getSql } from "@/lib/db";
import { messageFromRow } from "@/lib/messageJson";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-jwt-secret";

function requireAdmin(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return false;
  }
  const token = auth.slice("Bearer ".length).trim();
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

function dbErrorResponse(err) {
  if (err.code === "NO_DATABASE") {
    return NextResponse.json(
      { error: "Database not configured (set POSTGRES_URL or DATABASE_URL)." },
      { status: 503 }
    );
  }
  return null;
}

export async function PUT(request, context) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

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

  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      UPDATE messages SET name = ${name}, message = ${message} WHERE id = ${id}
      RETURNING id, name, message, created_at
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(messageFromRow(rows[0]));
  } catch (err) {
    const early = dbErrorResponse(err);
    if (early) return early;
    return NextResponse.json(
      { error: "Failed to update message", ...devErrorFields(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const deleted = await sql`
      DELETE FROM messages WHERE id = ${id} RETURNING id
    `;
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const early = dbErrorResponse(err);
    if (early) return early;
    return NextResponse.json(
      { error: "Failed to delete message", ...devErrorFields(err) },
      { status: 500 }
    );
  }
}
