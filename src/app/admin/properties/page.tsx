import { prisma } from "@/lib/prisma";

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

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Properties</h1>
        <p className="text-brand-400 text-sm mt-1">{properties.length} total properties</p>
      </div>

      <div className="bg-brand-900/50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Location</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">BHK</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Area</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-brand-300">{p.location}</td>
                  <td className="px-4 py-3 text-brand-300">{typeLabels[p.propertyType] || p.propertyType}</td>
                  <td className="px-4 py-3 text-brand-300">{p.bhk > 0 ? p.bhk : "-"}</td>
                  <td className="px-4 py-3 text-brand-300">{p.areaSqFt.toLocaleString()} sqft</td>
                  <td className="px-4 py-3 text-gold-400 font-medium">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.isActive
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
