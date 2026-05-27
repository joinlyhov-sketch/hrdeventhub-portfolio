"use client";

import CommentDemo from "@/components/site/pop-up/comment/CommentDemo";
import { AlertDialogDestructive } from "@/components/site/pop-up/commons/DeleteModal";
import { DropdownMenuDemo } from "@/components/site/pop-up/commons/DropDown";
import LogoutModal from "@/components/site/pop-up/commons/LogoutModal";
import ContentTypePopover from "@/components/site/pop-up/contents/pop-over-content";
import PaymentModal from "@/components/site/pop-up/payment/PaymentModal";
import { Button } from "@/components/ui/button";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import { useState } from "react";
import { CalendarDays, FileText, Newspaper } from "lucide-react";
import { PopoverItem } from "@/components/site/pop-up/contents/pop-over-content";
import { SwitchSizes } from "@/components/site/pop-up/commons/Toggle";
import VisibilitySelect from "@/components/site/pop-up/commons/SelectModal";
import ReactivateModal from "@/components/dashboard/pop-up/user-management-pop-up/ReactivateModal";

// 1. Import your interface type if it's exported elsewhere
import { UserData } from "@/data/UserData"; // adjust path as needed

// 2. Create the mock user matching the exact interface structure
const mockUser: UserData = {
  no: 1,
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  username: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 019-2834",
  gender: "Female",
  gen: 12,
  status: "Suspended" // Since we want to reactivate them!
};

const contentMenuOptions: PopoverItem[] = [
  {
    label: "Event",
    icon: CalendarDays,
    href: "/event-management/creation/event",
  },
  {
    label: "Announcement",
    icon: FileText,
    href: "/dashboard/announcements/new",
  },
  {
    label: "Article",
    icon: Newspaper,
    href: "/dashboard/articles/write",
  },
];

export default function Page() {
  const openPaymentModal = usePaymentModalStore((s) => s.openPaymentModal);
  const [logoutOpen, setLogoutOpen] = useState(false);
  
  // 3. Create state to track modal opening/closing
  const [reactivateOpen, setReactivateOpen] = useState(false);

  return (
    <main className="p-10 gap-5 flex flex-col items-start">
      <button
        className="border w-35 rounded-full cursor-pointer "
        onClick={() => openPaymentModal("register")}
      >
        Register Event
      </button>

      <button
        className="border w-25 rounded-full cursor-pointer "
        onClick={() => openPaymentModal("donation")}
      >
        Donate
      </button>

      <PaymentModal />

      <DropdownMenuDemo />

      <Button variant="destructive" onClick={() => setLogoutOpen(true)}>
        Test Logout Modal
      </Button>

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => {
          console.log("Logout confirmed");
          setLogoutOpen(false);
        }}
      />
      
      {/* 4. Interactive testing trigger for ReactivateModal */}
      <Button variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200" onClick={() => setReactivateOpen(true)}>
        Test Reactivate Modal
      </Button>

      <AlertDialogDestructive />

      <ContentTypePopover items={contentMenuOptions} />
      <h1 className="type-title text-secondary">Comment Feature</h1>
      <div className="mt-6 max-w-[700px]">
        <CommentDemo />
      </div>
      <SwitchSizes/>
      <VisibilitySelect/>

      {/* 5. Render conditionally with all compliant data mappings handled */}
      {reactivateOpen && (
        <ReactivateModal
          user={mockUser}
          onClose={() => setReactivateOpen(false)}
          onConfirm={(userId) => {
            console.log(`Successfully reactivated user database reference identifier: ${userId}`);
            setReactivateOpen(false);
          }}
        />
      )}
    </main>
  );
}