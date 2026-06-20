import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recordBehaviorAndRecalculate } from "@/lib/preferenceEngine";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { propertyId, action, viewDuration } = await req.json();

  if (!propertyId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await recordBehaviorAndRecalculate(
    session.user.id,
    propertyId,
    action,
    viewDuration || 0
  );

  return NextResponse.json({ ok: true });
}
