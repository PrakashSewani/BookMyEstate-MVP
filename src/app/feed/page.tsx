import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SwipeableCards from "@/components/SwipeableCards";
import Navbar from "@/components/Navbar";

export default async function FeedPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { onboardingCompleted: true, role: true, name: true, email: true },
  });

  if (!user?.onboardingCompleted && user?.role !== "ADMIN") {
    redirect("/onboarding");
  }

  const properties = await prisma.property.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const saved = await prisma.userBehavior.findMany({
    where: {
      userId: session!.user.id,
      action: "SAVE",
    },
    select: { propertyId: true },
  });

  const savedIds = new Set(saved.map((s) => s.propertyId));
  const unseen = properties.filter((p) => !savedIds.has(p.id));

  return (
    <div className="h-full w-full flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 min-h-0 flex items-center justify-center mb-16">
        <SwipeableCards properties={unseen} />
      </main>
    </div>
  );
}
