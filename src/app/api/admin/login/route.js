import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-jwt-secret";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
    return NextResponse.json({ token });
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
