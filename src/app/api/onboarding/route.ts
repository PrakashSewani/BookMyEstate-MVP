import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found — please log in again" }, { status: 401 });
    }

    const { locations } = await req.json();

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json({ error: "Select at least one location" }, { status: 400 });
    }

    const locationScores: Record<string, number> = {};
    for (const loc of locations) {
      locationScores[loc] = 5;
    }

    await prisma.inferredPreference.upsert({
      where: { userId: user.id },
      update: {
        locationScores: JSON.stringify(locationScores),
        lastUpdated: new Date(),
      },
      create: {
        userId: user.id,
        locationScores: JSON.stringify(locationScores),
        typeScores: JSON.stringify({}),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
