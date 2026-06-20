import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [propertyCount, activePropertyCount, userCount, leadCount, behaviorCount] =
    await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.lead.count(),
      prisma.userBehavior.count(),
    ]);

  const stats = [
    { label: "Total Properties", value: propertyCount, sub: `${activePropertyCount} active` },
    { label: "Users", value: userCount, sub: "registered" },
    { label: "Leads", value: leadCount, sub: "callback requests" },
    { label: "Interactions", value: behaviorCount, sub: "total actions" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-brand-400 text-sm mt-1">Overview of Book My Estate</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-brand-900/50 border border-white/10 rounded-2xl p-5"
          >
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-brand-200 mt-1">{stat.label}</div>
            <div className="text-xs text-brand-500 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
