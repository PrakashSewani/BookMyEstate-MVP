import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const property = await prisma.property.create({
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      location: body.location,
      propertyType: body.propertyType,
      bhk: body.bhk,
      areaSqFt: body.areaSqFt,
      images: JSON.stringify(body.images || []),
    },
  });

  return NextResponse.json(property, { status: 201 });
}
