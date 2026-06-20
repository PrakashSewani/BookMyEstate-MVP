import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pref = await prisma.inferredPreference.findUnique({
    where: { userId: session.user.id },
  });

  if (!pref) {
    return NextResponse.json({
      locationScores: {},
      typeScores: {},
      budgetMin: 0,
      budgetMax: 0,
    });
  }

  return NextResponse.json({
    locationScores: JSON.parse(pref.locationScores),
    typeScores: JSON.parse(pref.typeScores),
    budgetMin: pref.budgetMin,
    budgetMax: pref.budgetMax,
    lastUpdated: pref.lastUpdated,
  });
}
