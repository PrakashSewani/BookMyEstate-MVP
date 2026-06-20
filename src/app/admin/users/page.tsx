import { prisma } from "@/lib/prisma";

function formatPrice(price: number): string {
  if (price >= 10000000) return `\u20B9${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `\u20B9${(price / 100000).toFixed(1)} L`;
  return `\u20B9${price.toLocaleString()}`;
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { behaviors: true } },
      inferredPreference: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-brand-400 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="space-y-4">
        {users.map((user) => {
          const pref = user.inferredPreference;
          const locScores: Record<string, number> = pref
            ? JSON.parse(pref.locationScores)
            : {};
          const topLoc = Object.entries(locScores)
            .sort(([, a], [, b]) => b - a)[0];

          return (
            <div key={user.id} className="bg-brand-900/50 border border-white/10 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-brand-300 text-sm font-medium">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name || "Anonymous"}</div>
                    <div className="text-brand-400 text-xs">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  {user.role === "ADMIN" && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                      Admin
                    </span>
                  )}
                  <span className="text-brand-400">{user._count.behaviors} actions</span>
                  <span className="text-brand-500">
                    Joined {user.createdAt.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {pref && (
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-brand-500">Top Location: </span>
                    <span className="text-brand-200">{topLoc ? topLoc[0] : "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-brand-500">Budget: </span>
                    <span className="text-brand-200">
                      {pref.budgetMin > 0
                        ? `${formatPrice(pref.budgetMin)} - ${formatPrice(pref.budgetMax)}`
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-500">Last Updated: </span>
                    <span className="text-brand-200">
                      {new Date(pref.lastUpdated).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
