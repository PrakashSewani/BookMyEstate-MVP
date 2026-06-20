import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    include: { user: true, property: true },
    orderBy: { createdAt: "desc" },
  });

  const header = "Date,User Name,User Email,Property Title,Location,Price,Phone,Email,Message\n";
  const rows = leads
    .map(
      (l) =>
        `${l.createdAt.toISOString()},${l.user.name || ""},${l.user.email},${l.property.title},${l.property.location},${l.property.price},${l.phone},${l.email},"${(l.message || "").replace(/"/g, '""')}"`
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-export.csv"`,
    },
  });
}
