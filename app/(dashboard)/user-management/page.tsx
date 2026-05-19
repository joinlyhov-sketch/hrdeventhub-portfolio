import React from "react";
import { User, User2 } from "lucide-react";
import { UserData } from "../../../data/UserData";
import UserTableClient from "../../../components/dashboard/user-management/UserTable";


async function fetchUsers(): Promise<UserData[]> {
  return [
    { no: 1, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "sambathsok@gmail.com", phone: "012 921 999", gender: "Female", gen: 11, status: "Active" },
    { no: 2, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "soksan27@gmail.com", phone: "097 23 34 56", gender: "Male", gen: 12, status: "Active" },
    { no: 3, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "cheachea168@gmail.com", phone: "010 345 231", gender: "Female", gen: 11, status: "Suspended" },
    { no: 4, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "kaknika123@gmail.com", phone: "016 231 453", gender: "Female", gen: 14, status: "Active" },
    { no: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "sophalnem198@gmail.com", phone: "010 345 854", gender: "Female", gen: 5, status: "Active" },
    { no: 6, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "nene899@gmail.com", phone: "091 34 43 18", gender: "Female", gen: 6, status: "Active" },
    { no: 7, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "rector567@gmail.com", phone: "090 23 45 13", gender: "Male", gen: 7, status: "Active" },
    { no: 8, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "rector567@gmail.com", phone: "012 921 999", gender: "Female", gen: 8, status: "Active" },
    { no: 9, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "sathimmork@gmail.com", phone: "012 921 999", gender: "Female", gen: 12, status: "Active" },
    { no: 10, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "nika222@gmail.com", phone: "078 561 678", gender: "Female", gen: 10, status: "Active" },
    { no: 11, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", username: "Sok Sambath", email: "endyshi@gmail.com", phone: "012 921 999", gender: "Female", gen: 11, status: "Suspended" }
  ];
}

export default async function UserManagementPage() {
  const initialUsers = await fetchUsers();

  return (
    <div className="w-full max-w-[1400px] mx-auto my-auto p-3 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 text-secondary border-b border-gray-50 pb-2">
        <User2 size={24} className="stroke-[2.5]" />
        <h2 className="text-xl font-bold tracking-tight">Registered User</h2>
      </div>
      <UserTableClient initialUsers={initialUsers} />
    </div>
  );
}