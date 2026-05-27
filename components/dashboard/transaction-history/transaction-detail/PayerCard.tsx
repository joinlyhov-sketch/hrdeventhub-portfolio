"use client";

import {
  User,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
} from "lucide-react";
import { Payer } from "../../../../types/transaction-detail";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import Link from "next/link";

interface PayerCardProps {
  payer: Payer;
}

export function PayerCard({ payer }: PayerCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm w-full">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-secondary" strokeWidth={1.75} />
          <h3 className="text-subtitle-24 font-bold text-[#0F2854]">
            Payer Information
          </h3>
        </div>
        <Link
          href={"/profile"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex text-primary items-center gap-1.5 text-sm font-semibold type-desc hover:underline"
        >
          <span>View Profile</span>
          <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16 border border-gray-100">
          <AvatarImage
            src={payer.avatar}
            alt={payer.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100 text-lg font-bold text-gray-600">
            {payer.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1.5">
          <h4 className="type-subtitle font-bold text-secondary">
            {payer.name}
          </h4>
          <div>
            <span className="inline-block bg-[#E5EAFC] text-secondary type-detail-medium font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              {payer.badge}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-[#2C5295]">
            <GraduationCap className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="type-detail-semibold uppercase tracking-wider text-gray-500 mb-0.5">
              Generation
            </p>
            <p className="type-detail-medium text-gray-900">
              {payer.generation}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-[#2C5295]">
            <BookOpen className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="type-detail-semibold uppercase tracking-wider text-gray-500 mb-0.5">
              Skill
            </p>
            <p className="type-detail-medium text-gray-900">{payer.skill}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Email Field */}
        <div className="flex items-center gap-4 bg-[#F5F8FF] rounded-xl p-4 transition-colors hover:bg-[#EEF3FF]">
          <Mail className="w-5 h-5 text-[#0F2854]" strokeWidth={2} />
          <div>
            <p className="type-detail-semibold uppercase tracking-wider text-gray-500 mb-0.5">
              Email Address
            </p>
            <p className="text-base font-medium text-gray-800">{payer.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F8FF] rounded-xl p-4 transition-colors hover:bg-[#EEF3FF]">
          <Phone className="w-5 h-5 text-[#0F2854]" strokeWidth={2} />
          <div>
            <p className="type-detail-semibold uppercase tracking-wider text-gray-500 mb-0.5">
              Phone Number
            </p>
            <p className="text-base font-medium text-gray-800">{payer.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
