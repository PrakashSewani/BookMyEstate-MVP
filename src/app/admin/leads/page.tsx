"use client";

import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  property: { title: string; location: string; price: number };
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `\u20B9${(price / 10000000).toFixed(1)} Cr`;
  return `\u20B9${(price / 100000).toFixed(1)} L`;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    window.open("/api/admin/export", "_blank");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-brand-400 text-sm mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-brand-400 text-sm mt-1">{leads.length} callback requests</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="bg-brand-900/50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">User</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Property</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-brand-400 font-medium">Message</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-brand-500">
                    No leads yet
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-brand-300 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-white">{lead.user.name || lead.user.email}</td>
                    <td className="px-4 py-3">
                      <div className="text-brand-200">{lead.property.title}</div>
                      <div className="text-brand-500 text-xs">{lead.property.location}</div>
                    </td>
                    <td className="px-4 py-3 text-brand-300">{lead.phone}</td>
                    <td className="px-4 py-3 text-brand-300">{lead.email}</td>
                    <td className="px-4 py-3 text-brand-400 text-xs max-w-[200px] truncate">
                      {lead.message || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
