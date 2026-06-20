import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";

  const leads = await prisma.lead.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    include: { user: true, property: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { propertyId, name, phone, email, message } = await req.json();

  if (!propertyId || !name || !phone || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      userId: session.user.id,
      propertyId,
      name,
      phone,
      email,
      message,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
