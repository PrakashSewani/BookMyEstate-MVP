import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

function formatPrice(price: number): string {
  if (price >= 10000000) return `\u20B9${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `\u20B9${(price / 100000).toFixed(1)} L`;
  return `\u20B9${price.toLocaleString()}`;
}

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, createdAt: true },
  });

  const pref = await prisma.inferredPreference.findUnique({
    where: { userId },
  });

  const behaviorCount = await prisma.userBehavior.count({ where: { userId } });
  const leadCount = await prisma.lead.count({ where: { userId } });

  const locationScores: Record<string, number> = pref ? JSON.parse(pref.locationScores) : {};
  const typeScores: Record<string, number> = pref ? JSON.parse(pref.typeScores) : {};

  const sortedLocations = Object.entries(locationScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const sortedTypes = Object.entries(typeScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxLocationScore = sortedLocations.length > 0 ? sortedLocations[0][1] : 1;

  const typeLabels: Record<string, string> = {
    APARTMENT: "Apartment",
    VILLA: "Villa",
    PENTHOUSE: "Penthouse",
    PLOT: "Plot",
  };

  return (
    <div className="h-dvh bg-brand-950 flex flex-col">
      <Navbar user={user!} />
      <main className="flex-1 overflow-y-auto lg:pt-14 pb-16 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-8 lg:px-8 space-y-6">
          <div className="bg-brand-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xl font-bold">
                {(user?.name || user?.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{user?.name || "Anonymous"}</h1>
                <p className="text-brand-400 text-sm">{user?.email}</p>
                <p className="text-brand-500 text-xs mt-0.5">
                  Joined {user?.createdAt.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-white">{behaviorCount}</div>
                <div className="text-xs text-brand-400">Interactions</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-white">{leadCount}</div>
                <div className="text-xs text-brand-400">Callback Requests</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-gold-400">{pref ? "Active" : "New"}</div>
                <div className="text-xs text-brand-400">Preference Status</div>
              </div>
            </div>
          </div>

          <div className="bg-brand-900/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-1">Inferred Preferences</h2>
            <p className="text-brand-400 text-xs mb-5">
              Based on your browsing behavior and interactions
            </p>

            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-brand-200">Preferred Locations</h3>
              {sortedLocations.length === 0 ? (
                <p className="text-brand-500 text-xs">No data yet. Start exploring properties!</p>
              ) : (
                sortedLocations.map(([loc, score]) => (
                  <div key={loc} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-300">{loc}</span>
                      <span className="text-brand-500">{score.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-brand-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                        style={{ width: `${(score / maxLocationScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-brand-200">Property Type Preferences</h3>
              {sortedTypes.length === 0 ? (
                <p className="text-brand-500 text-xs">No data yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sortedTypes.map(([type, score]) => (
                    <div
                      key={type}
                      className="px-3 py-1.5 rounded-full bg-brand-800 border border-white/10 text-xs"
                    >
                      <span className="text-brand-200">{typeLabels[type] || type}</span>
                      <span className="text-brand-500 ml-1.5">{score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-brand-200 mb-3">Estimated Budget Range</h3>
              {pref && pref.budgetMin > 0 ? (
                <div className="bg-brand-800/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-bold text-brand-200">
                        {formatPrice(pref.budgetMin)}
                      </div>
                      <div className="text-xs text-brand-500">Min</div>
                    </div>
                    <div className="flex-1 mx-4 h-px bg-gradient-to-r from-brand-600 via-gold-500 to-brand-600" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-gold-400">
                        {formatPrice(pref.budgetMax)}
                      </div>
                      <div className="text-xs text-brand-500">Max</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-brand-500 text-xs">No budget data yet. Like some properties to get started!</p>
              )}
            </div>
          </div>

          <div className="bg-brand-900/30 border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-brand-300 mb-3">Feed Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-brand-500">
              <div><kbd className="px-1.5 py-0.5 bg-brand-800 rounded text-brand-300 font-mono">↑</kbd> Previous</div>
              <div><kbd className="px-1.5 py-0.5 bg-brand-800 rounded text-brand-300 font-mono">↓</kbd> Next</div>
              <div><kbd className="px-1.5 py-0.5 bg-brand-800 rounded text-brand-300 font-mono">S</kbd> Like</div>
              <div><kbd className="px-1.5 py-0.5 bg-brand-800 rounded text-brand-300 font-mono">B</kbd> Save</div>
              <div><kbd className="px-1.5 py-0.5 bg-brand-800 rounded text-brand-300 font-mono">C</kbd> Callback</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
