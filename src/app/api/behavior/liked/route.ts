import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const liked = await prisma.userBehavior.findMany({
    where: {
      userId: session.user.id,
      action: "LIKE",
    },
    select: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(liked.map((l) => l.property));
}
