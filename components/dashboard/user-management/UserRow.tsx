import React from "react";
import { Edit2, UserX, UserCheck, SquarePen, UserX2, UserRoundCheck } from "lucide-react";
import { UserData } from "../../../data/UserData";

interface UserRowProps {
  user: UserData;
  onEditRole: (user: UserData) => void;
  onToggleSuspend: (user: UserData) => void;
}

export default function UserRow({
  user,
  onEditRole,
  onToggleSuspend,
}: UserRowProps) {
  const isActive = user.status === "Active";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3 text-desc text-gray-500 text-center ">
        {user.no}
      </td>
      <td className="px-6 py-3 text-desc text-gray-500">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-desc text-gray-500">{user.username}</span>
        </div>
      </td>
      <td className="px-5 py-3 text-desc text-gray-500 ">{user.email}</td>
      <td className="px-6 py-3 text-desc text-gray-500 ">{user.phone}</td>
      <td className="px-6 py-3 text-desc text-gray-500 ">{user.gender}</td>
      <td className="px-5 py-3 text-desc text-gray-500 text-center">
        {user.gen}
      </td>
      <td className="px-6 py-3 text-desc text-gray-500 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isActive
              ? "bg-[#E6F9F1] text-accent"
              : "bg-[#FEECEB] text-[#EA1D24]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-accent" : "bg-[#EA1D24]"}`}
          />
          {user.status}
        </span>
      </td>
      <td className="px-6 py-3 text-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onEditRole(user)}
            className="text-slate-600 hover:text-blue-900 transition-colors"
          >
            <SquarePen size={18} />
          </button>
          <button
            type="button"
            onClick={() => onToggleSuspend(user)}
            className={`transition-colors ${isActive ? "text-[#EA1D24] hover:text-red-700" : "text-accent hover:text-green-700"}`}
          >
            {isActive ? <UserX2 size={18} /> : <UserRoundCheck size={18} />}
          </button>
        </div>
      </td>
    </tr>
  );
}
