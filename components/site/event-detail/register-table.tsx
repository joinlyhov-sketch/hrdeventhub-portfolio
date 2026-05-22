"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatsCard } from "./../../dashboard/transaction-history/StatsCard";

export function AdminOverview() {

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$124,50" 
          color="primary" 
          customIcon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary">
              <path d="M10 1v18M14 4H8a2 2 0 000 4h4a2 2 0 010 4H5"/>
            </svg>
          }
        />
        <StatsCard 
          title="Total Attendee" 
          value="69" 
          color="action" 
          customIcon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-action">
              <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM17 18c0-3-3-5.5-7-5.5s-7 2.5-7 5.5"/>
            </svg>
          }
        />
        <StatsCard 
          title="Today" 
          value="+6" 
          color="subtle" 
          customIcon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-subtle">
              <path d="M10 4v12M4 10h12"/>
            </svg>
          }
        />
        <StatsCard 
          title="This week" 
          value="+12" 
          color="subtle" 
          customIcon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-subtle">
              <path d="M10 4v12M4 10h12"/>
            </svg>
          }
        />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="type-detail-semibold text-grey-900">Recent registrations</h3>
          <Link href="#" className="text-primary flex items-center gap-x-1 type-desc-small-semibold">
            see all <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground type-detail-medium">
                <th className="p-2.5">Username & Email</th>
                <th className="p-2.5">Phone</th>
                <th className="p-2.5">Gender</th>
                <th className="p-2.5">Gen ↑</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card text-grey-500 type-detail">
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="hover:bg-grey-50">
                  <td className="p-2.5 flex items-center gap-x-2">
                    <div className="w-6 h-6 rounded-full bg-grey-100" />
                    <div>
                      <p className="type-detail-semibold text-grey-900">Sok Sambath</p>
                      <p className="text-grey-400 type-detail-small-medium">sambathsok@gmail.com</p>
                    </div>
                  </td>
                  <td className="p-2.5 text-foreground">012 921 999</td>
                  <td className="p-2.5">Female</td>
                  <td className="p-2.5">11</td>
                  <td className="p-2.5">
                    <span className="bg-subtle/10 text-subtle px-2 py-0.5 rounded-md type-detail-small-medium font-semibold border border-subtle/20">
                      Paid
                    </span>
                  </td>
                  <td className="p-2.5 text-grey-400">2 min ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}