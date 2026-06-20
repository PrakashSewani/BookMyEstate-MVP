import { prisma } from "./prisma";

const WEIGHTS: Record<string, number> = {
  LIKE: 3,
  SAVE: 5,
  SKIP: -1,
  CALLBACK: 4,
  VIEW: 0.5,
};

export async function recordBehaviorAndRecalculate(
  userId: string,
  propertyId: string,
  action: string,
  viewDuration: number = 0
) {
  await prisma.userBehavior.create({
    data: { userId, propertyId, action, viewDuration },
  });

  await recalculatePreferences(userId);
}

export async function recalculatePreferences(userId: string) {
  const behaviors = await prisma.userBehavior.findMany({
    where: { userId },
    include: { property: true },
  });

  const locationScores: Record<string, number> = {};
  const typeScores: Record<string, number> = {};
  let budgetSum = 0;
  let budgetCount = 0;

  for (const b of behaviors) {
    let weight = WEIGHTS[b.action] ?? 0;

    if (b.action === "VIEW" && b.viewDuration > 0) {
      weight = Math.min((b.viewDuration / 10) * WEIGHTS.VIEW, 3);
    }

    locationScores[b.property.location] =
      (locationScores[b.property.location] || 0) + weight;

    typeScores[b.property.propertyType] =
      (typeScores[b.property.propertyType] || 0) + weight;

    if (["LIKE", "SAVE", "CALLBACK"].includes(b.action)) {
      budgetSum += b.property.price;
      budgetCount++;
    }
  }

  const budgetMin = budgetCount ? Math.round((budgetSum * 0.7) / budgetCount) : 0;
  const budgetMax = budgetCount ? Math.round((budgetSum * 1.3) / budgetCount) : 0;

  await prisma.inferredPreference.upsert({
    where: { userId },
    update: {
      locationScores: JSON.stringify(locationScores),
      typeScores: JSON.stringify(typeScores),
      budgetMin,
      budgetMax,
      lastUpdated: new Date(),
    },
    create: {
      userId,
      locationScores: JSON.stringify(locationScores),
      typeScores: JSON.stringify(typeScores),
      budgetMin,
      budgetMax,
    },
  });
}
