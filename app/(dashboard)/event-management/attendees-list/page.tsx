import React from 'react'
import AttendeeTableClient from '../../../../components/dashboard/event-management/attendee/AttendeeTable';
import { User2 } from 'lucide-react';
import { AttendeeData } from '../../../../data/AttendeeData';
import { Breadcrumb } from '../../../../components/dashboard/BreadCrumb';

async function fetchAttendee(): Promise<AttendeeData[]> {
  return [
    { no: 1, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Ty Dine", gender: "Male", timestamp: "21 min ago", remark: "Great attendee", amount: 11, status: "Successful" },
    { no: 2, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Dita Rector", gender: "Male", timestamp: "1 hour ago", remark: "Late arrival", amount: 12, status: "Pending" },     
    { no: 3, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Souy Tivea", gender: "Female", timestamp: "2 hour ago", remark: "No show", amount: 11, status: "Failed" },
    { no: 4, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Heim Sreynith", gender: "Female", timestamp: "3 hour ago", remark: "Great attendee", amount: 14, status: "Successful" },    
    { no: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Chham Kaknika", gender: "Female", timestamp: "4 hour ago", remark: "Great attendee", amount: 5, status: "Successful" },
    { no: 6, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Hout Sonika", gender: "Female", timestamp: "5 hour ago", remark: "Great attendee and perfect attendance", amount: 6, status: "Successful" },
    { no: 7, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Oeng Endy", gender: "Male", timestamp: "6 hour ago", remark: "Great attendee", amount: 7, status: "Successful" },
    { no: 8, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Nem Sophal", gender: "Male", timestamp: "7 hour ago", remark: "Great attendee", amount: 8, status: "Successful" },
    { no: 9, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Chiv Lyhov", gender: "Male", timestamp: "8 hour ago", remark: "Great attendee", amount: 12, status: "Successful" },    
    { no: 10, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Meng Vireak", gender: "Male", timestamp: "9 hour ago", remark: "Great attendee", amount: 10, status: "Successful" },
    { no: 11, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", name: "Chenda Kolika", gender: "Female", timestamp: "10 hour ago", remark: "Great attendee", amount: 11, status: "Failed" }];
}

export default async function AttendeesManagementPage() {
  const initialAttendee = await fetchAttendee();

  return (
    <div className="w-full max-w-full mx-auto my-auto p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <Breadcrumb label="All attendees list" />
      <div className="flex items-center gap-2.5 text-secondary border-b border-gray-50 pb-2">
        <User2 size={24} className="stroke-[2.5]" />
        <h2 className="text-xl font-bold tracking-tight">Registered Attendees </h2>
      </div>
      <AttendeeTableClient initialAttendees={initialAttendee} />
    </div>
  );
}
