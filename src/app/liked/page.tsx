import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function formatPrice(price: number): string {
  if (price >= 10000000) return `\u20B9${(price / 10000000).toFixed(1)} Cr`;
  return `\u20B9${(price / 100000).toFixed(1)} L`;
}

const typeLabels: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PENTHOUSE: "Penthouse",
  PLOT: "Plot",
};

export default async function LikedPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, role: true },
  });

  const liked = await prisma.userBehavior.findMany({
    where: { userId: session!.user.id, action: "LIKE" },
    select: { property: true },
    orderBy: { createdAt: "desc" },
  });

  const properties = Array.from(
    new Map(liked.map((l) => [l.property.id, l.property])).values()
  );

  return (
    <div className="h-dvh bg-brand-950 flex flex-col">
      <Navbar user={user!} />
      <main className="flex-1 overflow-y-auto lg:pt-14 pb-16 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Liked Properties</h1>
              <p className="text-brand-400 text-sm mt-1">{properties.length} properties liked</p>
            </div>
            <Link href="/feed" className="px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 text-sm font-medium transition-colors">
              Back to Feed
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-brand-400">No liked properties yet.</p>
              <Link href="/feed" className="text-gold-400 text-sm mt-2 inline-block hover:text-gold-300">
                Start exploring
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((p) => {
                const images: string[] = JSON.parse(p.images);
                return (
                  <div key={p.id} className="bg-brand-900/50 border border-white/5 rounded-xl overflow-hidden group">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white/70 font-medium uppercase">
                        {typeLabels[p.propertyType] || p.propertyType}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-lg font-bold text-white">{formatPrice(p.price)}</div>
                      <div className="text-sm text-brand-200 font-medium">{p.title}</div>
                      <div className="text-xs text-brand-400 flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {p.location}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-brand-500 mt-2">
                        {p.bhk > 0 && <span>{p.bhk} BHK</span>}
                        <span>{p.areaSqFt.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
