import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "analytics",
      endpoint: "profile-view",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Use /api/analytics/view/profile-view",
    },
    {
      status: 404,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      ok: false,
      error: "Method not allowed",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      ok: false,
      error: "Method not allowed",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      ok: false,
      error: "Method not allowed",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}